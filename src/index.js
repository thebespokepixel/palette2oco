/*
 * Open Color Converter for Sip, JSON and ASE palettes
 * ──────────────────────────────────────────────────────────────
 * ©2019 Mark Griffiths @ The Bespoke Pixel (MIT licensed)
 */

import {createConsole} from 'verbosity'

import Reader from './classes/reader'
import writer from './writer'

export * from './utils'

export const console = createConsole({outStream: process.stderr})

/**
 * Read source data from an array of paths and return a Reader instance.
 * @param  {string[]} pathArray An Array of paths to load.
 * @return {Reader} The Reader instance.
 */
export function paletteReader(pathArray) {
	return new Reader(pathArray)
}

/**
 * Write an Open Color format palette to the destination.
 * @param  {string} destination The destination path.
 * @param  {OpenColor} palette  The Open Color palette data.
 * @return {Promise} A promise that resoves when file is saved.
 */
export function paletteWriter(destination, palette) {
	return writer(destination, palette)
}
