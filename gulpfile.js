/*
 * Gulp User Tasks
 */

const gulp = require('gulp')
const cordial = require('@thebespokepixel/cordial')()

// transpilation/formatting
gulp.task('bundle', cordial.macro({
	source: 'src/index.js'
}).basic())

gulp.task('master', cordial.macro({
	master: true,
	source: 'src/index.js'
}).basic())

gulp.task('cli', gulp.series(
	cordial.format({
		source: 'src/cli.js'
	}).rollup.babel({
		banner: '#! /usr/bin/env node',
		dest: 'bin/palette2oco.js'
	}),

	cordial.shell().permissions({
		mode: '755',
		dest: 'bin/palette2oco.js'
	})
))

// Hooks
gulp.task('start-release', gulp.series('reset', 'master', 'cli'))

// Clean
gulp.task('clean', cordial.shell({
	source: ['npm-debug.log', './nyc_output', './test/coverage']
}).trash())

// Tests
gulp.task('ava', cordial.test().ava(['test/*.js']))
gulp.task('xo', cordial.test().xo(['src/**.js']))
gulp.task('test', gulp.parallel('xo', 'ava'))

// Default
gulp.task('default', gulp.series('bump', 'bundle', 'cli'))
