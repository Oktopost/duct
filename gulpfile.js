'use strict';


const gulp		= require('gulp');
const clean		= require('gulp-clean');
const minify	= require('gulp-minify');
const concat	= require('gulp-concat');
const wrap		= require("gulp-wrap");
const replace	= require('gulp-string-replace');


gulp.task('test', () => {
	console.log('Gulp works!');
});


gulp.task('clean-web', () => {
	return gulp.src('./bin/*')
		.pipe(clean());
});

gulp.task('prepare-web', ['clean-web'], () => {
	return gulp.src([
			'./src/Classy.js',
			'./src/Event.js',
			'./src/Listener.js'
		])
		
		.pipe(replace(/module\.exports = Event;/, 'module\.exports = {Event: Event};'))
		.pipe(replace(/module\.exports = Listener;/, 'module\.exports = {Listener: Listener};'))
		.pipe(replace(/module\.exports = \{ classify: classify \};/, 'module\.exports = {Classy: {classify: classify}};'))
	
		.pipe(replace(/require\(\'oktopost-plankton\'\).is/, 'plankton.is'))
		.pipe(replace(/require\(\'oktopost-plankton\'\).array/, 'plankton.array'))
		.pipe(replace(/require\(\'oktopost-plankton\'\).func/, 'plankton.func'))
		.pipe(replace(/require\(\'oktopost-plankton\'\).obj/, 'plankton.obj'))
		
		.pipe(replace(/require\('\.\/Classy'\)/, 'oktopostJS.duct.Classy'))
		.pipe(replace(/require\('\.\/Event'\)/, 'oktopostJS.duct.Event'))
		.pipe(replace(/require\('\.\/Listener'\)/, 'oktopostJS.duct.Listener'))
		
		.pipe(wrap({src: './gulp/web/web-mixin.js.template'}))
		.pipe(gulp.dest('./bin/tmp'));
});


gulp.task('build-web', ['clean-web', 'prepare-web'], () => {
	return gulp.src([
			'./gulp/web/web-prefix.js',
			'./bin/tmp/Classy.js',
			'./bin/tmp/Event.js',
			'./bin/tmp/Listener.js',
		])
		.pipe(concat('duct.js'))
		.pipe(gulp.dest('./'))
		.pipe(minify())
		.pipe(gulp.dest('./'));
});