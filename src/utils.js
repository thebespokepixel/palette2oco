/* ────────────╮
 │ palette2oco │ Utilities
 ╰─────────────┴─────────────────────────────────────────────────────────────── */

import _ from 'lodash'
import {OCOValueEX} from '@thebespokepixel/oco-colorvalue-ex'

export function oco2Object(oco) {
	const output = {}
	const recurseForPath = (entry, tree) => {
		if (entry.name === 'Root') {
			return tree
		}
		return recurseForPath(entry.parent, {
			[entry.name]: tree
		})
	}

	oco.tree.traverseTree(['Color', 'Reference'], entry => {
		const color = entry.type === 'Color' ? entry : entry.resolved()
		_.merge(output, recurseForPath(entry.parent, {
			[entry.name]: new OCOValueEX(color.get(0).identifiedValue.getOriginalInput(), entry.name)
		}))
	})
	return output
}

export function oco2Vars(oco, prefix = '') {
	let output = ''
	const recurseForPath = entry => {
		if (entry.name === 'Root') {
			return ''
		}
		return `${recurseForPath(entry.parent)} ${entry.name}`
	}
	oco.tree.traverseTree(['Color', 'Reference'], entry => {
		const color = entry.type === 'Color' ? entry : entry.resolved()
		output += `${prefix}${_.kebabCase(recurseForPath(entry))} = ${color.get(0).identifiedValue.toString('rgb')}\n`
	})
	return output
}
