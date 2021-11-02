/* ────────────╮
 │ palette2oco │ File writing promise
 ╰─────────────┴─────────────────────────────────────────────────────────────── */

import fs from 'node:fs'
import {promisify} from 'es6-promisify'
import {console} from '.'

const writeFile = promisify(fs.writeFile)

export default function writer(destination, contents) {
	console.debug(`Writing file to ${destination}`)
	return writeFile(destination, contents)
}
