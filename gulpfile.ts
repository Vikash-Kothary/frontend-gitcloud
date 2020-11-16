// file: gulpfile.ts

// Imports
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as exec from 'gulp-exec';

// Config
const config = {
	src: ['packages/**/*.ts', 'docs/**/*.md']
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
// Private
gulp.task('postinstall:deduplicate', deduplicate);
gulp.task('postinstall:autoclean', autoclean);



// Public
gulp.task('default', placeholder);
gulp.task('postinstall', gulp.series(
	'postinstall:deduplicate',
	'postinstall:autoclean'
));
gulp.task('docs', placeholder);
gulp.task('lint', placeholder);
gulp.task('test', placeholder);
gulp.task('build', placeholder);
gulp.task('start', placeholder);