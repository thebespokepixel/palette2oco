/*
 * Open Color Converter for Sip, JSON and ASE palettes
 * ──────────────────────────────────────────────────────────────
 * ©2016 Mark Griffiths @ The Bespoke Pixel (MIT licensed)
 */

import {relative as relativePath} from 'path'
import fs from 'fs'

import _ from 'lodash'
import {promisify} from 'es6-promisify'
import {OCOValueEX, fromPrecise, fromBytes} from '@thebespokepixel/oco-colorvalue-ex'
import oco from 'opencolor'
import ase from 'ase-util'
import {console} from '..'

const loader = promisify(fs.readFile)

const supportedTypes = [
	'oco',
	'json',
	'sippalette',
	'ase'
]

const fileFilter = new RegExp(`.(${supportedTypes.join('|')})$`)
const fileMatch = new RegExp(`(.*/)*(.+?).(${supportedTypes.join('|')})$`)

function createIdentity(rootPath) {
	return function (path) {
		const address = path
			.replace(rootPath, '')
			.match(fileMatch)
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
		red: (datum.red >= min && datum.red <= max) && datum.red,
		green: (datum.green >= min && datum.green <= max) && datum.green,
		blue: (datum.blue >= min && datum.blue <= max) && datum.blue,
		alpha: (datum.alpha >= min && datum.alpha <= max) && datum.alpha
	}
}

function isPaletteJSON(datum) {
	const tests = {
		palette: {
			name: (typeof datum.name === 'string') && datum.name,
			colors: (Array.isArray(datum.colors)) && datum.colors
		},
		rgba: testPaletteJSONColor(datum, 0.0, 1.0),
		rgbaInteger: testPaletteJSONColor(datum, 0, 255)
	}
	return {
		isPalette: _.isEqual(datum, tests.palette),
		isRGBA: _.isEqual(datum, tests.rgba),
		isIntegerRGBA: _.isEqual(datum, tests.rgbaInteger)
	}
}

async function loadOCO(identity) {
	const ocoSource = await loader(identity.source, 'utf8')
	return oco.parse(ocoSource)
}

async function loadJSON(identity) {
	const json = await loader(identity.source, 'utf8')
	const palette = JSON.parse(json)

	if (isPaletteJSON(palette).isPalette) {
		console.debug(`JSON Palette: ${palette.name}`)
		return new oco.Entry(
			identity.name,
			[OCOValueEX.generateOCO(
				palette.name,
				palette.colors.map(color => {
					const paletteColor = isPaletteJSON(color)
					switch (true) {
						case paletteColor.isRGBA:
							console.debug(`JSON Color (RGBA): ${color.name}`)
							return fromPrecise(color)
						case paletteColor.isIntegerRGBA:
							console.debug(`JSON Color (Integer RGBA): ${color.name}`)
							return fromBytes(color)
						default:
							throw new Error(`${color.name}.json is not a valid JSON color object`)
					}
				})
			)]
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
							console.debug(`ASE Color (RGB/Grayscale): ${datum.name}`)
							return new OCOValueEX(datum.color.hex, datum.name)
						case 'CMYK':
							console.debug(`ASE Color (CMYK): ${datum.name}`)
							return new OCOValueEX({
								cyan: datum.color.c,
								magenta: datum.color.m,
								yellow: datum.color.y,
								black: datum.color.k
							}, datum.name)
						case 'LAB':
							console.debug(`ASE Color (Lab): ${datum.name}`)
							return new OCOValueEX({
								L: datum.color.lightness,
								a: datum.color.a,
								b: datum.color.b
							}, datum.name)
						default:
							throw new Error(`${datum.color.model} is not a valid ASE color model`)
					}

				case 'group':
					console.debug(`ASE Group: ${datum.name}`)
					return OCOValueEX.generateOCO(
						datum.name,
						scan(datum.entries)
					)

				default:
					throw new Error(`${datum.type} is not a valid ASE data type`)
			}
		})
	}

	const aseSource = await loader(identity.source)
	const palette = await ase.read(aseSource)

	if (Array.isArray(palette)) {
		return palette.length === 1 ? new oco.Entry(
			identity.name,
			scan(palette)
		) : OCOValueEX.generateOCO(
			identity.name,
			scan(palette)
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

export default class Reader {
	constructor(source_) {
		this.sourcePath = source_
		this.tree = new oco.Entry()
	}

	pick(key_) {
		return key_ ? this.tree.get(key_) : this.tree.root()
	}

	/**
	 * Transform the internal color palette to a range of additional formats.
	 * @private
	 * @param  {string[]} formats - An array of color formats to add to the palette.
	 * @return {Reader} The Reader instance.
	 */
	transform(formats) {
		this.tree.traverseTree('Color', color_ => {
			const original = color_.get(0).identifiedValue.getOriginalInput()
			color_.children = []

			formats.forEach((format, index_) => {
				const newFormat = new OCOValueEX(original, color_.name)
				newFormat._format = format

				color_.addChild(new oco.ColorValue(
					format,
					newFormat.toString(format),
					newFormat
				), true, index_)
			})
		})
		return this
	}

	/**
	 * Load palette data from an array of paths.
	 * @private
	 * @param  {string[]} pathArray The array of paths to load.
	 * @return {Promise} A Promise that resolves with this instance when loaded.
	 */
	async load(pathArray) {
		await Promise.all(pathArray
			.filter(file => file.match(fileFilter))
			.map(createIdentity(this.sourcePath))
			.map(async identity => {
				const entry = await selectLoaderByIndentity(identity.type)(identity)
				entry.addMetadata({
					'import/file/source': relativePath(process.cwd(), identity.source),
					'import/file/type': identity.type
				})
				this.tree.set(`${identity.path}${identity.name}`, entry)
			})
		)
		return this
	}

	render(path) {
		return oco.render(this.pick(path))
	}
}
