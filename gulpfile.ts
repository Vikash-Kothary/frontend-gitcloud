// @ts-nocheck
// file: gulpfile.ts

// Imports
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as exec from 'gulp-exec';
import { exec as sh } from 'child_process';
import * as eslint from 'gulp-eslint';
import * as ts from 'gulp-typescript';
import * as del from 'del';
import * as vinylPaths from 'vinyl-paths';


// Config
const config = {
	src: {
		typescript: ['packages/**/*.ts', '!**/node_modules/**', ],
		markdown: ['docs/**/*.md']
	},
	eslint: {
		configPath: 'packages/internals/src/eslint/.eslintrc.json',
		ignorePath: 'packages/internals/src/eslint/.eslintignore'
	},
	storybook: {
		port: 31000,
		configFolder: 'packages/internals/src/storybook',
		buildFolder: 'build/docs'
	},
	autoclean: {
		configFile: 'packages/internals/src/autoclean/.yarnclean'
	},
	clean: {
		typescript: ['packages/**/lib', '!**/node_modules/**']
	},
}


// Internals
const buildStorybook = (cb) => {
	let cmd = `yarn build-storybook`;
	cmd += ` -c ${config.storybook.configFolder}`;
	cmd += ` -o ${config.storybook.buildFolder}`;
	// cmd += ` --docs`;
	// cmd += ` --watch`;
	cmd += ` --quiet`;
	sh(cmd, (err, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
}

const runStorybook = (cb) => {
	let cmd = `yarn start-storybook`;
	cmd += ` -c ${config.storybook.configFolder}`;
	cmd += ` -p ${config.storybook.port}`;
	cmd += ` --quiet`;
	sh(cmd, (err, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
}

const autoclean = (cb) => {
	let cmd = `rm_if_link(){ [ ! -L "$1" ] || rm "$1"; }`
	cmd += ` && ln -s ${config.autoclean.configFile} .yarnclean`
	cmd += ` && yarn autoclean --force`;
	cmd += ` && rm_if_link .yarnclean`;
	sh(cmd, (err, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
}

const deduplicate = (cb) => {
	let cmd = `yarn yarn-deduplicate`;
	sh(cmd, (err, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
}

const placeholder = () => {
	return gulp.src(config.src.typescript)
		.pipe(debug())
}

const lintTS = () => {
	return gulp.src(config.src.typescript)
		.pipe(debug())
		.pipe(eslint({ configFile: config.eslint.configPath }))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
}

const cleanTypescript = () => {
	return gulp.src(config.clean.typescript)
		.pipe(debug())
		.pipe(vinylPaths(del));
}


// Private
gulp.task('postinstall:deduplicate', deduplicate);
gulp.task('postinstall:autoclean', autoclean);
gulp.task('lint:typescript', lintTS);
gulp.task('lint:typescript:fix', placeholder);
gulp.task('build:storybook', buildStorybook);
gulp.task('run:storybook', runStorybook);
gulp.task('clean:typescript', cleanTypescript);

// Public
gulp.task('default', placeholder);
gulp.task('postinstall', gulp.series(
	'postinstall:deduplicate',
	'postinstall:autoclean'
));
gulp.task('docs', gulp.parallel(
	'run:storybook'
));
gulp.task('lint', gulp.series(
	'lint:typescript',
	'lint:typescript:fix'
));
gulp.task('test', placeholder);
gulp.task('build', gulp.parallel(
	'build:storybook'
));
gulp.task('start', placeholder);
gulp.task('clean', gulp.parallel(
	'clean:typescript'
));
