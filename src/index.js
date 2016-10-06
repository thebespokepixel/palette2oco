/*
 * Open Color Converter for Sip, JSON and ASE palettes
 * ──────────────────────────────────────────────────────────────
 * ©2016 Mark Griffiths @ The Bespoke Pixel (MIT licensed)
 */

import {createConsole} from 'verbosity'

import Reader from './classes/reader'
import writer from './writer'

export * from './utils'

export const console = createConsole({outStream: process.stderr})

export function paletteReader(pathArray) {
	return new Reader(pathArray)
}

export function paletteWriter(destination, palette) {
	return writer(destination, palette)
}
