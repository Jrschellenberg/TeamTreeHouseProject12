const gulp = require('gulp'),
	  concat = require('gulp-concat'),
		clean = require("gulp-clean"),
		sass = require('gulp-sass'),
		fs = require('fs'),
		cleanCss = require("gulp-clean-css");

const devServePath = 'src/public';
const devCssServePath = devServePath+'/stylesheets/';


//Gets all Files in this directory, then appends the directory with the file name.
const concatCSSFiles = fs.readdirSync(devCssServePath).map((file) => {
	return devCssServePath+file;
});


gulp.task('concatCssProd', () => {
	return gulp.src(concatCSSFiles)
		.pipe(concat('bundle.css'))
		.pipe(cleanCss())
		.pipe(gulp.dest('dist/public/stylesheets'))
});

gulp.task('buildCssProd', ['concatCssProd'], () => {
	return process.exit(0);
});


gulp.task('cleanDist', () => {
	return gulp.src('dist/*')
		.pipe(clean());
});


gulp.task('sass:build', function () {
	return gulp.src('./src/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./src/public/stylesheets'));
});

gulp.task('sass:watch', function () {
	gulp.watch('./src/sass/**/*.scss', ['sass:build']);
});

