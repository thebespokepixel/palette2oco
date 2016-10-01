/*
 * Open Color Converter for Sip, JSON and ASE palettes
 * ──────────────────────────────────────────────────────────────
 * ©2016 Mark Griffiths @ The Bespoke Pixel (MIT licensed)
 */

// import path from 'path'
import fs from 'fs'
import promisify from 'es6-promisify'
import {console} from './index'

const writeFile = promisify(fs.writeFile)

export default function writer(destination, oco) {
	console.debug(`Writing oco file to ${destination}`)
	return writeFile(destination, oco)
}
