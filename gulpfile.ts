// @ts-nocheck
// file: gulpfile.ts

// Imports
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as exec from 'gulp-exec';
import { exec as sh } from 'child_process';
import * as eslint from 'gulp-eslint';


// Config
const config = {
	src: {
		typescript: ['packages/**/*.ts', '!**/node_modules/**', ],
		markdown: ['docs/**/*.md']
	},
	typescript: {
		configPath: 'packages/internals/src/eslint/.eslintrc.json',
		ignorePath: 'packages/internals/src/eslint/.eslintignore'
	},
	storybook: {
		port: 31000,
		configFolder: 'packages/internals/src/storybook',
		buildFolder: 'build/docs'
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
		cb(error);
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
		cb(error);
	});
}

const placeholder = () => {
	return gulp.src(config.src.typescript)
		.pipe(debug())
}

const deduplicate = () => {
	return gulp.src('yarn.lock')
		.pipe(debug())
		.pipe(exec('yarn yarn-deduplicate'))
		.pipe(gulp.dest('./'))
}

const autoclean = () => {
	return gulp.src(['node_modules/**'])
		.pipe(debug())
		.pipe(exec('yarn autoclean --force'))
		.pipe(gulp.dest('./node_modules'))
}

const lintTS = () => {
	return gulp.src(config.src.typescript)
		.pipe(debug())
		.pipe(eslint({ configFile: config.typescript.configPath }))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
}


// Private
gulp.task('postinstall:deduplicate', deduplicate);
gulp.task('postinstall:autoclean', autoclean);
gulp.task('lint:typescript', lintTS);
gulp.task('lint:typescript:fix', placeholder);
gulp.task('build:storybook', buildStorybook)
gulp.task('run:storybook', runStorybook)

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