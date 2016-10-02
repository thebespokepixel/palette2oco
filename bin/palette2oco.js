#! /usr/bin/env node
'use strict'

function _interopDefault(ex) {
	return (ex && (typeof ex === 'object') && 'default' in ex) ? ex.default : ex
}

var _initial = _interopDefault(require('lodash/initial'))
var _tail = _interopDefault(require('lodash/tail'))
var path = require('path')
var truwrap = _interopDefault(require('truwrap'))
var commonTags = require('common-tags')
var _thebespokepixel_string = require('@thebespokepixel/string')
var yargs = _interopDefault(require('yargs'))
var globby = _interopDefault(require('globby'))
var readPkg = _interopDefault(require('read-pkg'))
var updateNotifier = _interopDefault(require('update-notifier'))
var trucolor = _interopDefault(require('trucolor'))
var verbosity = require('verbosity')
var _isEqual = _interopDefault(require('lodash/isEqual'))
var fs = _interopDefault(require('fs'))
var promisify = _interopDefault(require('es6-promisify'))
var _thebespokepixel_ocoColorvalueEx = require('@thebespokepixel/oco-colorvalue-ex')
var oco = _interopDefault(require('opencolor'))
var ase = _interopDefault(require('ase-util'))

const loader = promisify(fs.readFile)

const supportedTypes = ['oco', 'json', 'sippalette', 'ase']

const fileFilter = new RegExp(`.(${supportedTypes.join('|')})$`)
const fileMatch = new RegExp(`(.*/)(.+?).(${supportedTypes.join('|')})$`)

function createIdentity(rootPath) {
	return function (path) {
		const address = path.replace(rootPath, '').match(fileMatch)
		return {
			source: path,
			name: address[2],
			path: address[1].replace(/^\//, '').replace(/\//g, '.'),
			type: address[3]
		}
	}
}

function testPaletteJSONColor(datum, min, max) {
	return {
		name: typeof datum.name === 'string' && datum.name,
		red: datum.red >= min && datum.red <= max && datum.red,
		green: datum.green >= min && datum.green <= max && datum.green,
		blue: datum.blue >= min && datum.blue <= max && datum.blue,
		alpha: datum.alpha >= min && datum.alpha <= max && datum.alpha
	}
}

function isPaletteJSON(datum) {
	const tests = {
		palette: {
			name: typeof datum.name === 'string' && datum.name,
			colors: Array.isArray(datum.colors) && datum.colors
		},
		rgba: testPaletteJSONColor(datum, 0.0, 1.0),
		rgbaInteger: testPaletteJSONColor(datum, 0, 255)
	}
	return {
		isPalette: _isEqual(datum, tests.palette),
		isRGBA: _isEqual(datum, tests.rgba),
		isIntegerRGBA: _isEqual(datum, tests.rgbaInteger)
	}
}

function loadOCO(identity) {
	return loader(identity.source, 'utf8').then(oco.parse)
}

function loadJSON(identity) {
	return loader(identity.source, 'utf8').then(JSON.parse).then(palette => {
		if (isPaletteJSON(palette).isPalette) {
			console.debug(`JSON Palette: ${palette.name}`)
			return new oco.Entry(identity.name, [_thebespokepixel_ocoColorvalueEx.OCOValueEX.generateOCO(palette.name, palette.colors.map(color => {
				const paletteColor = isPaletteJSON(color)
				switch (true) {
					case paletteColor.isRGBA:
						console.debug(`JSON Color (RGBA): ${color.name}`)
						return _thebespokepixel_ocoColorvalueEx.fromPrecise(color)
					case paletteColor.isIntegerRGBA:
						console.debug(`JSON Color (Integer RGBA): ${color.name}`)
						return _thebespokepixel_ocoColorvalueEx.fromBytes(color)
					default:
						throw new Error(`${color.name}.json is not a valid JSON color object`)
				}
			}))])
		}
		throw new Error(`${identity.name}.json is not a valid palette`)
	})
}

function loadASE(identity) {
	function scan(node) {
		return node.map(datum => {
			switch (datum.type) {
				case 'color':
					switch (datum.color.model) {
						case 'Gray':
						case 'RGB':
							console.debug(`ASE Color (RGB/Grayscale): ${datum.name}`)
							return new _thebespokepixel_ocoColorvalueEx.OCOValueEX(datum.color.hex, datum.name)
						case 'CMYK':
							console.debug(`ASE Color (CMYK): ${datum.name}`)
							return _thebespokepixel_ocoColorvalueEx.fromCMYK({
								name: datum.name,
								cyan: datum.color.c,
								magenta: datum.color.m,
								yellow: datum.color.y,
								black: datum.color.k
							})
						case 'LAB':
							console.debug(`ASE Color (Lab): ${datum.name}`)
							return _thebespokepixel_ocoColorvalueEx.fromLab({
								name: datum.name,
								L: datum.color.lightness,
								a: datum.color.a,
								b: datum.color.b
							})
						default:
							throw new Error(`${datum.color.model} is not a valid ASE color model`)
					}

				case 'group':
					console.debug(`ASE Group: ${datum.name}`)
					return _thebespokepixel_ocoColorvalueEx.OCOValueEX.generateOCO(datum.name, scan(datum.entries))

				default:
					throw new Error(`${datum.type} is not a valid ASE data type`)
			}
		})
	}

	return loader(identity.source).then(ase.read).then(palette => {
		if (Array.isArray(palette)) {
			return palette.length === 1 ? new oco.Entry(identity.name, scan(palette)) : _thebespokepixel_ocoColorvalueEx.OCOValueEX.generateOCO(identity.name, scan(palette))
		}
		throw new Error(`${identity.name}.ase is not a valid palette`)
	})
}

function selectLoaderByIndentity(type) {
	switch (type) {
		case 'sippalette':
			return loadJSON
		case 'json':
			return loadJSON
		case 'ase':
			return loadASE
		case 'oco':
			return loadOCO
		default:
			throw new Error(`${type} is not recognised`)
	}
}

class Reader {
	constructor(source_) {
		this.sourcePath = source_
		this.tree = new oco.Entry()
	}

	pick(key_) {
		return key_ ? this.tree.get(key_) : this.tree.root()
	}

	transformColors(formats) {
		this.tree.traverseTree('Color', color_ => {
			const original = color_.get(0).identifiedValue.getOriginalInput()
			color_.children = []

			formats.forEach((format, index_) => {
				const newFormat = new _thebespokepixel_ocoColorvalueEx.OCOValueEX(original, color_.name)
				newFormat._format = format

				color_.addChild(new oco.ColorValue(format, newFormat.toString(format), newFormat), true, index_)
			})
		})
		return this
	}

	load(pathArray) {
		return Promise.all(pathArray.filter(file => file.match(fileFilter)).map(createIdentity(this.sourcePath)).map(identity => selectLoaderByIndentity(identity.type)(identity).then(entry => {
			entry.addMetadata({
				'import/file/source': path.relative(process.cwd(), identity.source),
				'import/file/type': identity.type
			})
			return entry
		}).then(entry => this.tree.set(`${identity.path}${identity.name}`, entry)))).then(() => this)
	}

	render(path) {
		return oco.render(this.pick(path))
	}
}

const writeFile = promisify(fs.writeFile)

function writer(destination, oco) {
	console.debug(`Writing oco file to ${destination}`)
	return writeFile(destination, oco)
}

const console = verbosity.createConsole({
	outStream: process.stderr
})

function paletteReader(pathArray) {
	return new Reader(pathArray)
}

function paletteWriter(palette, destination) {
	return writer(palette, destination)
}

const clr = trucolor.simplePalette()

const _package = readPkg.sync(path.resolve(__dirname, '..'))

const renderer = truwrap({
	outStream: process.stderr
})

const colorReplacer = new commonTags.TemplateTag(commonTags.replaceSubstitutionTransformer(/([a-zA-Z]+?)[:/|](.+)/, (match, colorName, content) => `${clr[colorName]}${content}${clr[colorName].out}`))

const title = _thebespokepixel_string.box(colorReplacer`${'title|palette2oco'}${`dim| │ v${_package.version}`}`, {
	borderColor: 'red',
	margin: {
		top: 1
	},
	padding: {
		bottom: 0,
		top: 0,
		left: 2,
		right: 2
	}
})

const usage = commonTags.stripIndent(colorReplacer)`${title}

	Convert palette data from a variety of sources into Open Color .oco format.

	Allows structured directories of pallette data to be converted into nested oco palette data.

	Formats supported:
	Sip (http://sipapp.io): Supports .sippalette and .json exports.

	Abobe Swatch Exchange (ASE): Full support of RGB, CMYK and Lab colorspaces.

	Vanilla JSON: File signature must match the following...

	  {
	    "name" : "Palette name",
	    "colors" : [
	      {
	        name: "Color name",
	        red: (0.0 - 1.0 | 0 - 255)
	        green: (0.0 - 1.0 | 0 - 255)
	        blue: (0.0 - 1.0 | 0 - 255)
	        alpha: (0.0 - 1.0 | 0 - 255)
	      }
	      ...
	    ]
	  }

	Usage:
	${'command|palette2oco'} ${'option|[options]'} ${'argument|sourceGlob'} ${'argument|outputFile'}`

const epilogue = colorReplacer`${'green|© 2016'} ${'brightGreen|The Bespoke Pixel.'} ${'grey|Released under the MIT License.'}`

yargs.strict().options({
	h: {
		alias: 'help',
		describe: 'Display help.'
	},
	v: {
		alias: 'version',
		count: true,
		describe: 'Print version to stdout. -vv Print name & version.'
	},
	V: {
		alias: 'verbose',
		count: true,
		describe: 'Be verbose. -VV Be loquacious.'
	},
	color: {
		describe: 'Force color output. Disable with --no-color'
	}
}).wrap(renderer.getWidth())

const argv = yargs.argv

if (!(process.env.USER === 'root' && process.env.SUDO_USER !== process.env.USER)) {
	updateNotifier({
		pkg: _package
	}).notify()
}

if (argv.help) {
	renderer.write(usage)
	renderer.break(2)
	renderer.write(yargs.getUsageInstance().help())
	renderer.break()
	renderer.write(epilogue)
	renderer.break(1)
	process.exit(0)
}

if (argv.version) {
	const version = _package.buildNumber > 0 ? `${_package.version}-Δ${_package.buildNumber}` : `${_package.version}`
	process.stdout.write(argv.version > 1 ? `${_package.name} v${version}` : version)
	process.exit(0)
}

if (argv.verbose) {
	switch (argv.verbose) {
		case 1:
			console.verbosity(4)
			console.log(`${clr.title}Verbose mode${clr.title.out}:`)
			break
		case 2:
			console.verbosity(5)
			console.log(`${clr.title}Extra-Verbose mode${clr.title.out}:`)
			console.yargs(argv)
			break
		default:
			console.verbosity(3)
	}
}

if (argv._.length > 1) {
	const root = path.resolve()
	const dest = path.resolve(_tail(argv._)[0])
	globby(_initial(argv._)).then(pathArray => paletteReader(root).load(pathArray)).then(pal => pal.render()).then(contents => paletteWriter(dest, contents)).catch(err => {
		console.error(err)
		process.exit(1)
	})
} else {
	console.error('palette2oco needs at least a source and a destination.')
	process.exit(1)
}
