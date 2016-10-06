import test from 'ava'
import {OCOValueEX} from '@thebespokepixel/oco-colorvalue-ex'
import {paletteReader, oco2Object, oco2Vars} from '..'

const objectTemplate = {
	test: {
		Test: {
			'Ku Crimson': new OCOValueEX('rgb(240, 0, 0)', 'Ku Crimson'),
			'Titanium Yellow': new OCOValueEX('rgb(240, 240, 0)', 'Titanium Yellow'),
			'Lime': new OCOValueEX('rgb(0, 240, 0)', 'Lime'),
			'Turquoise Blue': new OCOValueEX('rgb(0, 240, 240)', 'Turquoise Blue'),
			'Blue': new OCOValueEX('rgb(0, 0, 240)', 'Blue'),
			'Fuchsia': new OCOValueEX('rgb(240, 0, 240)', 'Fuchsia')
		}
	}
}

const varTemplate = `test-test-ku-crimson = #f00000
test-test-titanium-yellow = #f0f000
test-test-lime = #00f000
test-test-turquoise-blue = #00f0f0
test-test-blue = #0000f0
test-test-fuchsia = #f000f0
`

test('Named palette (JSON) to Object', t => {
	return paletteReader('fixtures/in/json')
		.load(['fixtures/in/json/test.json'])
		.then(oco2Object)
		.then(palette => {
			t.deepEqual(palette, Object.assign(objectTemplate, palette))
		})
})

test('Named palette (JSON) to Vars', t => {
	return paletteReader('fixtures/in/json')
		.load(['fixtures/in/json/test.json'])
		.then(oco2Vars)
		.then(palette => {
			t.is(palette, varTemplate)
		})
})
