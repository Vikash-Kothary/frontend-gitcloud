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


// Private




// Public
gulp.task('default', placeholder);
gulp.task('postinstall', placeholder);
gulp.task('docs', placeholder);
gulp.task('lint', placeholder);
gulp.task('test', placeholder);
gulp.task('build', placeholder);
gulp.task('start', placeholder);