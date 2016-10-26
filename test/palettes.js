import test from 'ava'
import {cat} from 'shelljs'
import {paletteReader} from '..'

test('Named palette (JSON)', async t => {
	const fixture = cat('fixtures/out/json.oco').toString()
	await paletteReader('fixtures/in/json')
		.load(['fixtures/in/json/test.json'])
		.then(palette => {
			t.is(palette.render(), fixture)
		})
})

test('Transformed palette (JSON)', async t => {
	const fixture = cat('fixtures/out/json-hsl.oco').toString()
	await paletteReader('fixtures/in/json')
		.load(['fixtures/in/json/test.json'])
		.then(palette => {
			t.is(palette.transform(['hsl']).render(), fixture)
		})
})

test('Bad palette (JSON)', async t => {
	await t.throws(paletteReader('fixtures/in/json')
		.load(['fixtures/in/json/invalid.json']))
})

test('Bad color (JSON)', async t => {
	await t.throws(paletteReader('fixtures/in/json')
		.load(['fixtures/in/json/bad-color.json']))
})

test('Named palette (Sip palette)', async t => {
	const fixture = cat('fixtures/out/sippalette.oco').toString()
	await paletteReader('fixtures/in/sippalette')
		.load(['fixtures/in/sippalette/test.sippalette'])
		.then(palette => {
			t.is(palette.render(), fixture)
		})
})

test('Named palette (OCO)', async t => {
	const fixture = cat('fixtures/out/oco.oco').toString()
	await paletteReader('fixtures/in/oco')
		.load(['fixtures/in/oco/test.oco'])
		.then(palette => {
			t.is(palette.render(), fixture)
		})
})

test('Named palette (ASE)', async t => {
	const fixture = cat('fixtures/out/ase.oco').toString()
	await paletteReader('fixtures/in/ase')
		.load(['fixtures/in/ase/test.ase'])
		.then(palette => {
			t.is(palette.render(), fixture)
		})
})

test('Invalid palette (ASE)', async t => {
	t.throws(paletteReader('fixtures/in/ase')
		.load(['fixtures/in/ase/invalid.ase']))
})

test('Photoshop palette (ASE)', async t => {
	const fixture = cat('fixtures/out/ps-test.oco').toString()
	await paletteReader('fixtures/in/ase')
		.load(['fixtures/in/ase/ps-test.ase'])
		.then(palette => {
			t.is(palette.render(), fixture)
		})
})
