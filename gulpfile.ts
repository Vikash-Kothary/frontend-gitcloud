// @ts-nocheck
// file: gulpfile.ts

// Imports
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as exec from 'gulp-exec';
import * as eslint from 'gulp-eslint';


// Config
const config = {
	src: ['packages/**/*.ts', '!**/node_modules/**', 'docs/**/*.md'],
	typescript: {
		configPath: 'packages/internals/src/lint/.eslintrc',
		ignorePath: 'packages/internals/src/lint/.eslintignore'
	}
}


// Internals
const placeholder = () => {
	return gulp.src(config.src)
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
	return gulp.src(config.src)
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


// Public
gulp.task('default', placeholder);
gulp.task('postinstall', gulp.series(
	'postinstall:deduplicate',
	'postinstall:autoclean'
));
gulp.task('docs', placeholder);
gulp.task('lint', gulp.series(
	'lint:typescript',
	'lint:typescript:fix'
));
gulp.task('test', placeholder);
gulp.task('build', placeholder);
gulp.task('start', placeholder);