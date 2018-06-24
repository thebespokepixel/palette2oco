/* ─────────────╮
 │ gulp/cordial │
 ╰──────────────┴────────────────────────────────────────────────────────────── */
const gulp = require('gulp')
const rename = require('gulp-rename')
const chmod = require('gulp-chmod')
const rollup = require('gulp-better-rollup')
const babel = require('rollup-plugin-babel')
const lodash = require('babel-plugin-lodash')

const external = [
	'@thebespokepixel/oco-colorvalue-ex',
	'@thebespokepixel/string',
	'ase-util',
	'common-tags',
	'es6-promisify',
	'es6-promisify',
	'fs',
	'globby',
	'lodash/initial',
	'lodash/isEqual',
	'lodash/kebabCase',
	'lodash/merge',
	'lodash/tail',
	'opencolor',
	'path',
	'read-pkg',
	'trucolor',
	'truwrap',
	'update-notifier',
	'verbosity',
	'yargs'
]

const babelConfig = {
	plugins: [lodash],
	presets: [
		['@babel/preset-env', {
			modules: false,
			targets: {
				node: '8.0.0'
			}
		}]
	],
	comments: false,
	exclude: 'node_modules/**'
}

gulp.task('cjs', () =>
	gulp.src('src/main.js')
		.pipe(rollup({
			external,
			plugins: [babel(babelConfig)]
		}, {
			format: 'cjs'
		}))
		.pipe(rename('index.js'))
		.pipe(gulp.dest('.'))
)

gulp.task('es6', () =>
	gulp.src('src/main.js')
		.pipe(rollup({
			external,
			plugins: [babel(babelConfig)]
		}, {
			format: 'es'
		}))
		.pipe(rename('index.mjs'))
		.pipe(gulp.dest('.'))
)

gulp.task('cli', () =>
	gulp.src('src/cli.js')
		.pipe(rollup({
			external,
			plugins: [babel(babelConfig)]
		}, {
			banner: '#! /usr/bin/env node',
			format: 'cjs'
		}))
		.pipe(rename('palette2oco'))
		.pipe(chmod(0o755))
		.pipe(gulp.dest('bin'))
)

gulp.task('default', gulp.series('cjs', 'es6', 'cli'))
