import test from 'ava'
import {cat} from 'shelljs'
import {paletteReader} from '..'

test('Named palette (JSON)', async t => {
	const fixture = cat('test/fixtures/out/json.oco').toString()
	await paletteReader('test/fixtures/in/json')
		.load(['test/fixtures/in/json/test.json'])
		.then(palette => {
			t.is(palette.render(), fixture)
		})
})

test('Transformed palette (JSON)', async t => {
	const fixture = cat('test/fixtures/out/json-hsl.oco').toString()
	await paletteReader('test/fixtures/in/json')
		.load(['test/fixtures/in/json/test.json'])
		.then(palette => {
			t.is(palette.transform(['hsl']).render(), fixture)
		})
})

test('Bad palette (JSON)', async t => {
	await t.throws(paletteReader('test/fixtures/in/json')
		.load(['test/fixtures/in/json/invalid.json']))
})

test('Bad color (JSON)', async t => {
	await t.throws(paletteReader('test/fixtures/in/json')
		.load(['test/fixtures/in/json/bad-color.json']))
})

test('Named palette (Sip palette)', async t => {
	const fixture = cat('test/fixtures/out/sippalette.oco').toString()
	await paletteReader('test/fixtures/in/sippalette')
		.load(['test/fixtures/in/sippalette/test.sippalette'])
		.then(palette => {
			t.is(palette.render(), fixture)
		})
})

test('Named palette (OCO)', async t => {
	const fixture = cat('test/fixtures/out/oco.oco').toString()
	await paletteReader('test/fixtures/in/oco')
		.load(['test/fixtures/in/oco/test.oco'])
		.then(palette => {
			t.is(palette.render(), fixture)
		})
})

test('Named palette (ASE)', async t => {
	const fixture = cat('test/fixtures/out/ase.oco').toString()
	await paletteReader('test/fixtures/in/ase')
		.load(['test/fixtures/in/ase/test.ase'])
		.then(palette => {
			t.is(palette.render(), fixture)
		})
})

test('Invalid palette (ASE)', async t => {
	t.throws(paletteReader('test/fixtures/in/ase')
		.load(['test/fixtures/in/ase/invalid.ase']))
})

test('Photoshop palette (ASE)', async t => {
	const fixture = cat('test/fixtures/out/ps-test.oco').toString()
	await paletteReader('test/fixtures/in/ase')
		.load(['test/fixtures/in/ase/ps-test.ase'])
		.then(palette => {
			t.is(palette.render(), fixture)
		})
})
