import test from 'ava'
import {OCOValueEX} from '@thebespokepixel/oco-colorvalue-ex'
import {paletteReader, oco2Object, oco2Vars} from '..'

const objectTemplate = {
	test: {
		Test: {
			'Ku Crimson': new OCOValueEX('rgb(240, 0, 0)', 'Ku Crimson'),
			'Titanium Yellow': new OCOValueEX('rgb(240, 240, 0)', 'Titanium Yellow'),
			Lime: new OCOValueEX('rgb(0, 240, 0)', 'Lime'),
			'Turquoise Blue': new OCOValueEX('rgba(0, 240, 240, 0.6)', 'Turquoise Blue'),
			Blue: new OCOValueEX('rgb(0, 0, 240)', 'Blue'),
			Fuchsia: new OCOValueEX('rgb(240, 0, 240)', 'Fuchsia')
		}
	}
}

const varTemplate = `test-test-ku-crimson = rgb(240, 0, 0)
test-test-titanium-yellow = rgb(240, 240, 0)
test-test-lime = rgb(0, 240, 0)
test-test-turquoise-blue = rgba(0, 240, 240, 0.6)
test-test-blue = rgb(0, 0, 240)
test-test-fuchsia = rgb(240, 0, 240)
`

test('Named palette (JSON) to Object', async t => {
	await paletteReader('fixtures/in/json')
		.load(['fixtures/in/json/test.json'])
		.then(oco2Object)
		.then(palette => {
			t.deepEqual(palette, Object.assign(objectTemplate, palette))
		})
})

test('Named palette (JSON) to Vars', async t => {
	await paletteReader('fixtures/in/json')
		.load(['fixtures/in/json/test.json'])
		.then(oco2Vars)
		.then(palette => {
			t.is(palette, varTemplate)
		})
})
