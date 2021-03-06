// @ts-nocheck
// file: gulpfile.ts

// Imports
import * as path from 'path';
import * as del from 'del';
import { exec as sh } from 'child_process';
import * as vinylPaths from 'vinyl-paths';
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as exec from 'gulp-exec';
import * as eslint from 'gulp-eslint';
import * as ts from 'gulp-typescript';
import * as rename from 'gulp-rename';
import * as template from 'gulp-template';


// Config
const config = {
	src: {
		sourceOptions: { base: './' },
		typescript: ['packages/**/*.ts', 'packages/**/*.tsx', '!packages/**/*.d.ts', '!**/node_modules/**'],
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
	yarn: {
		configFile: 'packages/internals/src/yarn/.yarnclean'
	},
	clean: {
		typescript: ['packages/**/lib', '!**/node_modules/**']
	},
	typescript: {
		configFile: 'packages/internals/src/typescript/tsconfig.json'
	},
	npm: {
		npmConfig: 'packages/internals/src/npm/.npmrc',
		npmRegistry: process.env.NPM_REGISTRY,
		npmScope: process.env.NPM_SCOPE,
		npmToken: process.env.NPM_TOKEN
	}
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

const startExpo = (cb) => {
	let cmd = `yarn workspace @vikash-kothary/gitcloud-app`;
	cmd += ` run start:web`;
	sh(cmd, (err, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
}

const autoclean = (cb) => {
	let cmd = `rm_if_link(){ [ ! -L "$1" ] || rm "$1"; }`
	cmd += ` && ln -s ${config.yarn.configFile} .yarnclean`
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

const prePublishNPM = () => {
	return gulp.src(config.npm.npmConfig)
		.pipe(template(process.env))
		.pipe(gulp.dest('.'))
}

const publishNPM = (cb) => {
	let cmd = `yarn lerna publish`;
	cmd += ` from-package`;
	cmd += ` --registry ${config.npm.configFile}`;
	cmd += ` --yes`;
	sh(cmd, (err, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
	
}

const postPublishNPM = () => {
	return del(['.npmrc']);
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

const buildTypescript = () => {
	const tsc = ts.createProject(config.typescript.configFile);

	return gulp.src(config.src.typescript, config.src.sourceOptions)
		.pipe(debug())
		.pipe(tsc())
		.pipe(rename((path) => {
			path.dirname = path.dirname.replace('src', 'lib')
		}))
		.pipe(debug())
		.pipe(gulp.dest('.'));
}

const cleanTypescript = () => {
	return gulp.src(config.clean.typescript)
		.pipe(debug())
		.pipe(vinylPaths(del));
}

const watchTypescript = () => {
	gulp.watch(config.src.typescript, gulp.series(
		'clean:typescript',
		'build:typescript'
	));
}


// Private
gulp.task('postinstall:deduplicate', deduplicate);
gulp.task('postinstall:autoclean', autoclean);
gulp.task('lint:typescript', lintTS);
gulp.task('lint:typescript:fix', placeholder);
gulp.task('build:typescript', buildTypescript);
gulp.task('build:storybook', buildStorybook);
gulp.task('run:storybook', runStorybook);
gulp.task('start:expo', startExpo);
gulp.task('publish:npm', publishNPM);
gulp.task('publish:npm:pre', prePublishNPM);
gulp.task('publish:npm:post', postPublishNPM);
gulp.task('clean:typescript', cleanTypescript);
gulp.task('watch:typescript', watchTypescript);


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
	'build:typescript',
	'build:storybook'
));
gulp.task('start', gulp.parallel(
	'start:expo'
));
gulp.task('publish', gulp.series(
	'publish:npm:pre',
	'publish:npm',
	'publish:npm:post',
))
gulp.task('clean', gulp.parallel(
	'clean:typescript'
));
gulp.task('watch', gulp.parallel(
	'watch:typescript'
));
