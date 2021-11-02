import {promisify} from 'node:util'
import {exec} from 'node:child_process'
import test from 'ava'

const execPromise = promisify(exec)

test('Test CLI version', async t => {
	const {stdout} = await execPromise('./palette2oco.js -vv')
	t.snapshot(stdout)
})

test('Test CLI ASE', async t => {
	const {stdout} = await execPromise('./palette2oco.js --stdout ./test/fixtures/in/ase/test.ase')
	t.snapshot(stdout)
})

test('Test CLI OCO', async t => {
	const {stdout} = await execPromise('./palette2oco.js --stdout ./test/fixtures/in/oco/test.oco')
	t.snapshot(stdout)
})

test('Test CLI JSON', async t => {
	const {stdout} = await execPromise('./palette2oco.js --stdout ./test/fixtures/in/json/test.json')
	t.snapshot(stdout)
})
