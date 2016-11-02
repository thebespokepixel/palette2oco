/* ─────────────────────────╮
 │ @thebespokepixel/xo-tidy │ CLI Utility
 ╰──────────────────────────┴────────────────────────────────────────────────── */
/* eslint unicorn/no-process-exit:0 */

import {resolve} from 'path'
import _ from 'lodash'
import {truwrap} from 'truwrap'
import {stripIndent, TemplateTag, replaceSubstitutionTransformer} from 'common-tags'
import {box} from '@thebespokepixel/string'
import yargs from 'yargs'
import globby from 'globby'
import readPkg from 'read-pkg'
import updateNotifier from 'update-notifier'
import {simple} from 'trucolor'
import {console, paletteReader, paletteWriter} from './index'

const clr = simple({format: 'sgr'})

const _package = readPkg.sync(resolve(__dirname, '..'))

const renderer = truwrap({
	outStream: process.stderr
})

const colorReplacer = new TemplateTag(
	replaceSubstitutionTransformer(
		/([a-zA-Z]+?)[:/|](.+)/,
		(match, colorName, content) => `${clr[colorName]}${content}${clr[colorName].out}`
	)
)

const title = box(colorReplacer`${'title|palette2oco'}${`dim| │ v${_package.version}`}`, {
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

const usage = stripIndent(colorReplacer)`${title}

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
	const root = resolve()
	const dest = resolve(_.tail(argv._)[0])
	globby(_.initial(argv._))
	.then(pathArray => paletteReader(root).load(pathArray))
	.then(pal => pal.render())
	.then(contents => paletteWriter(dest, contents))
	.catch(err => {
		console.error(err)
		process.exit(1)
	})
} else {
	console.error('palette2oco needs at least a source and a destination.')
	process.exit(1)
}
