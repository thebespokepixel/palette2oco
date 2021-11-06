#! /usr/bin/env node
import { relative, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import _ from 'lodash';
import { truwrap } from 'truwrap';
import { TemplateTag, replaceSubstitutionTransformer, stripIndent } from 'common-tags';
import { box } from '@thebespokepixel/string';
import meta from '@thebespokepixel/meta';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { globby } from 'globby';
import updateNotifier from 'update-notifier';
import { simple } from 'trucolor';
import { createConsole } from 'verbosity';
import fs from 'node:fs';
import { promisify } from 'es6-promisify';
import { OCOValueEX, fromBytes, fromPrecise } from '@thebespokepixel/oco-colorvalue-ex';
import oco from 'opencolor';
import ase from 'ase-util';

const name = "@thebespokepixel/palette2oco";
const version = "3.0.2";
const description = "Convert directories of Sip, JSON and ASE palette files to Open Color";
const main = "index.js";
const types = "index.d.ts";
const type = "module";
const files = [
	"index.js",
	"index.d.ts"
];
const bin = {
	palette2oco: "./palette2oco.js"
};
const scripts = {
	build: "rollup -c && chmod 755 palette2oco.js && npm run readme",
	test: "xo && c8 --reporter=text ava",
	"doc-serve": "documentation serve --watch --theme node_modules/documentation-theme-bespoke --github --config src/docs/documentation.yml --project-name $npm_package_name  --project-version $npm_package_version src/index.js",
	"doc-build": "documentation build --format html --output docs --theme node_modules/documentation-theme-bespoke --github --config src/docs/documentation.yml --project-name $npm_package_name  --project-version $npm_package_version src/index.js",
	readme: "compile-readme -u src/docs/example.md src/docs/readme.md > readme.md",
	coverage: "c8 --reporter=lcov ava; open coverage/lcov-report/index.html",
	prepublishOnly: "npx -p typescript tsc index.js --declaration --allowJs --emitDeclarationOnly"
};
const repository = {
	type: "git",
	url: "git+https://github.com/thebespokepixel/palette2oco.git"
};
const keywords = [
	"Open",
	"Color",
	"oco",
	"sip",
	"ase",
	"json",
	"color",
	"colour",
	"converter"
];
const author = "Mark Griffiths <mark@thebespokepixel.com> (http://thebespokepixel.com/)";
const copyright = {
	year: "2021",
	owner: "The Bespoke Pixel"
};
const license = "MIT";
const bugs = {
	url: "https://github.com/thebespokepixel/palette2oco/issues"
};
const homepage = "https://github.com/thebespokepixel/palette2oco#readme";
const dependencies = {
	"@thebespokepixel/meta": "^3.0.5",
	"@thebespokepixel/oco-colorvalue-ex": "^6.0.1",
	"@thebespokepixel/string": "^2.0.1",
	"ase-util": "^1.0.3",
	"common-tags": "^1.8.0",
	"es6-promisify": "^7.0.0",
	globby: "^12.0.2",
	lodash: "^4.17.21",
	opencolor: "^0.2.0",
	trucolor: "^4.0.4",
	truwrap: "^4.0.4",
	"update-notifier": "^5.1.0",
	verbosity: "^3.0.2",
	yargs: "^17.2.1"
};
const devDependencies = {
	"@rollup/plugin-commonjs": "^21.0.1",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-node-resolve": "^13.0.6",
	"@types/estree": "^0.0.50",
	ava: "^4.0.0-rc.1",
	c8: "^7.10.0",
	"documentation-theme-bespoke": "^2.0.14",
	rollup: "^2.59.0",
	"rollup-plugin-cleanup": "^3.2.1",
	xo: "^0.46.4"
};
const xo = {
	semicolon: false,
	ignores: [
		"index.js",
		"palette2oco.js",
		"index.d.ts",
		"docs/**",
		"coverage/**"
	]
};
const badges = {
	github: "thebespokepixel",
	npm: "thebespokepixel",
	"libraries-io": "TheBespokePixel",
	name: "palette2oco",
	codeclimate: "d58dd3cdc1459632afa5",
	providers: {
		aux1: {
			title: "github",
			text: "source",
			color: "4E73B6",
			link: "https://github.com/thebespokepixel/palette2oco"
		}
	},
	readme: {
		"Publishing Status": [
			[
				"npm",
				"libraries-io-npm"
			],
			[
				"travis-com",
				"rollup"
			]
		],
		"Development Status": [
			[
				"travis-com-dev",
				"libraries-io-github"
			],
			[
				"snyk",
				"code-climate",
				"code-climate-coverage"
			]
		],
		"Documentation/Help": [
			"inch",
			"twitter"
		]
	},
	docs: [
		[
			"aux1",
			"travis"
		],
		[
			"code-climate",
			"code-climate-coverage"
		],
		[
			"snyk",
			"libraries-io-npm"
		]
	]
};
const engines = {
	node: ">=10.0"
};
var pkg = {
	name: name,
	version: version,
	description: description,
	main: main,
	types: types,
	type: type,
	files: files,
	bin: bin,
	scripts: scripts,
	repository: repository,
	keywords: keywords,
	author: author,
	copyright: copyright,
	license: license,
	bugs: bugs,
	homepage: homepage,
	dependencies: dependencies,
	devDependencies: devDependencies,
	xo: xo,
	badges: badges,
	engines: engines
};

const loader = promisify(fs.readFile);
const supportedTypes = [
	'oco',
	'json',
	'sippalette',
	'ase',
];
const fileFilter = new RegExp(`.(${supportedTypes.join('|')})$`);
const fileMatch = new RegExp(`(.*/)*(.+?).(${supportedTypes.join('|')})$`);
function createIdentity(rootPath) {
	return function (path) {
		const address = path
			.replace(rootPath, '')
			.match(fileMatch);
		return {
			source: path,
			name: address[2],
			path: address[1].replace(/^\//, '').replace(/\//g, '.'),
			type: address[3],
		}
	}
}
function testPaletteJSONColor(datum, min, max) {
	return {
		name: typeof datum.name === 'string' && datum.name,
		red: (datum.red >= min && datum.red <= max) && datum.red,
		green: (datum.green >= min && datum.green <= max) && datum.green,
		blue: (datum.blue >= min && datum.blue <= max) && datum.blue,
		alpha: (datum.alpha >= min && datum.alpha <= max) && datum.alpha,
	}
}
function isPaletteJSON(datum) {
	const tests = {
		palette: {
			name: (typeof datum.name === 'string') && datum.name,
			colors: (Array.isArray(datum.colors)) && datum.colors,
		},
		rgba: testPaletteJSONColor(datum, 0, 1),
		rgbaInteger: testPaletteJSONColor(datum, 0, 255),
	};
	return {
		isPalette: _.isEqual(datum, tests.palette),
		isRGBA: _.isEqual(datum, tests.rgba),
		isIntegerRGBA: _.isEqual(datum, tests.rgbaInteger),
	}
}
async function loadOCO(identity) {
	const ocoSource = await loader(identity.source, 'utf8');
	return oco.parse(ocoSource)
}
async function loadJSON(identity) {
	const json = await loader(identity.source, 'utf8');
	const palette = JSON.parse(json);
	if (isPaletteJSON(palette).isPalette) {
		console.debug(`JSON Palette: ${palette.name}`);
		return new oco.Entry(
			identity.name,
			[OCOValueEX.generateOCO(
				palette.name,
				palette.colors.map(color => {
					const paletteColor = isPaletteJSON(color);
					switch (true) {
						case paletteColor.isRGBA:
							console.debug(`JSON Color (RGBA): ${color.name}`);
							return fromPrecise(color)
						case paletteColor.isIntegerRGBA:
							console.debug(`JSON Color (Integer RGBA): ${color.name}`);
							return fromBytes(color)
						default:
							throw new Error(`${color.name}.json is not a valid JSON color object`)
					}
				}),
			)],
		)
	}
	throw new Error(`${identity.name}.json is not a valid palette`)
}
async function loadASE(identity) {
	function scan(node) {
		return node.map(datum => {
			switch (datum.type) {
				case 'color':
					switch (datum.color.model) {
						case 'Gray':
						case 'RGB':
							console.debug(`ASE Color (RGB/Grayscale): ${datum.name}`);
							return new OCOValueEX(datum.color.hex, datum.name)
						case 'CMYK':
							console.debug(`ASE Color (CMYK): ${datum.name}`);
							return new OCOValueEX({
								cyan: datum.color.c,
								magenta: datum.color.m,
								yellow: datum.color.y,
								black: datum.color.k,
							}, datum.name)
						case 'LAB':
							console.debug(`ASE Color (Lab): ${datum.name}`);
							return new OCOValueEX({
								L: datum.color.lightness,
								a: datum.color.a,
								b: datum.color.b,
							}, datum.name)
						default:
							throw new Error(`${datum.color.model} is not a valid ASE color model`)
					}
				case 'group':
					console.debug(`ASE Group: ${datum.name}`);
					return OCOValueEX.generateOCO(
						datum.name,
						scan(datum.entries),
					)
				default:
					throw new Error(`${datum.type} is not a valid ASE data type`)
			}
		})
	}
	const aseSource = await loader(identity.source);
	const palette = await ase.read(aseSource);
	if (Array.isArray(palette)) {
		return palette.length === 1 ? new oco.Entry(
			identity.name,
			scan(palette),
		) : OCOValueEX.generateOCO(
			identity.name,
			scan(palette),
		)
	}
	throw new Error(`${identity.name}.ase is not a valid palette`)
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
		this.sourcePath = source_;
		this.tree = new oco.Entry();
	}
	pick(key_) {
		return key_ ? this.tree.get(key_) : this.tree.root()
	}
	transform(formats) {
		this.tree.traverseTree('Color', color_ => {
			const original = color_.get(0).identifiedValue.getOriginalInput();
			color_.children = [];
			for (const [index_, format] of formats.entries()) {
				const newFormat = new OCOValueEX(original, color_.name);
				newFormat._format = format;
				color_.addChild(new oco.ColorValue(
					format,
					newFormat.toString(format),
					newFormat,
				), true, index_);
			}
		});
		return this
	}
	async load(pathArray) {
		await Promise.all(pathArray
			.filter(file => file.match(fileFilter))
			.map(file => createIdentity(this.sourcePath)(file))
			.map(async identity => {
				const entry = await selectLoaderByIndentity(identity.type)(identity);
				entry.addMetadata({
					'import/file/source': relative(process.cwd(), identity.source),
					'import/file/type': identity.type,
				});
				this.tree.set(`${identity.path}${identity.name}`, entry);
			}),
		);
		return this
	}
	render(path) {
		return oco.render(this.pick(path))
	}
}

const writeFile = promisify(fs.writeFile);
function writer(destination, contents) {
	console.debug(`Writing file to ${destination}`);
	return writeFile(destination, contents)
}

const console = createConsole({outStream: process.stderr});
function paletteReader(pathArray) {
	return new Reader(pathArray)
}
function paletteWriter(destination, palette) {
	return writer(destination, palette)
}

const clr = simple({format: 'sgr'});
const metadata = meta(dirname(fileURLToPath(import.meta.url)));
const renderer = truwrap({
	outStream: process.stderr,
});
const colorReplacer = new TemplateTag(
	replaceSubstitutionTransformer(
		/([a-zA-Z]+?)[:/|](.+)/,
		(match, colorName, content) => `${clr[colorName]}${content}${clr[colorName].out}`,
	),
);
const title = box(colorReplacer`${'title|palette2oco'}${`dim| │ ${metadata.version(3)}`}`, {
	borderColor: 'red',
	margin: {
		top: 1,
	},
	padding: {
		bottom: 0,
		top: 0,
		left: 2,
		right: 2,
	},
});
const usage = stripIndent(colorReplacer)`
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
	${'command|palette2oco'} ${'option|[options]'} ${'argument|sourceGlob'} ${'argument|outputFile'}`;
const epilogue = colorReplacer`${'brightGreen|' + metadata.copyright} ${'grey|Released under the MIT License.'}`;
const yargsInstance = yargs(hideBin(process.argv))
	.strictOptions()
	.help(false)
	.version(false)
	.options({
		h: {
			alias: 'help',
			describe: 'Display help.',
		},
		v: {
			alias: 'version',
			count: true,
			describe: 'Print version to stdout. -vv Print name & version.',
		},
		V: {
			alias: 'verbose',
			count: true,
			describe: 'Be verbose. -VV Be loquacious.',
		},
		o: {
			alias: 'stdout',
			type: 'boolean',
			describe: 'Print output to stdout.',
		},
		color: {
			describe: 'Force color output. Disable with --no-color',
		},
	});
const {argv} = yargsInstance;
if (!(process.env.USER === 'root' && process.env.SUDO_USER !== process.env.USER)) {
	updateNotifier({pkg}).notify();
}
if (argv.help) {
	(async () => {
		const usageContent = await yargsInstance.wrap(renderer.getWidth()).getHelp();
		renderer.write(title).break(2);
		renderer.write(usage);
		renderer.break(2);
		renderer.write(usageContent);
		renderer.break();
		renderer.write(epilogue);
		renderer.break(1);
		process.exit(0);
	})();
}
if (argv.version) {
	process.stdout.write(metadata.version(argv.version));
	process.exit(0);
}
if (argv.verbose) {
	switch (argv.verbose) {
		case 1:
			console.verbosity(4);
			console.log(`${clr.title}Verbose mode${clr.title.out}:`);
			break
		case 2:
			console.verbosity(5);
			console.log(`${clr.title}Extra-Verbose mode${clr.title.out}:`);
			console.yargs(argv);
			break
		default:
			console.verbosity(3);
	}
}
async function processor(paths) {
	const root = resolve();
	const pathArray = await globby(paths);
	const pal = await paletteReader(root).load(pathArray);
	return pal.render()
}
(async () => {
	console.log(argv._.length);
	if (argv.stdout) {
		if (argv._.length > 0) {
			try {
				process.stdout.write(await processor(argv._));
			} catch (error) {
				console.error(error);
				process.exit(1);
			}
		} else {
			console.error('palette2oco needs at least a source.');
			process.exit(1);
		}
	} else if (argv._.length > 1) {
		try {
			const dest = resolve(_.tail(argv._)[0]);
			paletteWriter(dest, await processor(_.initial(argv._)));
		} catch (error) {
			console.error(error);
			process.exit(1);
		}
	} else {
		console.error('palette2oco needs at least a source and a destination.');
		process.exit(1);
	}
})();
