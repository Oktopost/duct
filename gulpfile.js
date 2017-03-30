'use strict';


const gulp		= require('gulp');
const clean		= require('gulp-clean');
const minify	= require('gulp-minify');
const concat	= require('gulp-concat');
const wrap		= require('gulp-wrap');
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
			'./src/debug/EventDebug.js',
			'./src/Classy.js',
			'./src/Event.js',
			'./src/Listener.js',
			'./src/Creator.js',
			'./src/handlers/CachedEventHandler.js'
		])
		
		.pipe(replace(/module\.exports = Event;/, 'module\.exports = {Event: Event};'))
		.pipe(replace(/module\.exports = Listener;/, 'module\.exports = {Listener: Listener};'))
		.pipe(replace(/module\.exports = Creator;/, 'module\.exports = {Creator: Creator};'))
		.pipe(replace(/module\.exports = \{ classify: classify \};/, 'module\.exports = {Classy: {classify: classify}};'))
		.pipe(replace(/module\.exports = EventDebug;/, 'module\.exports = {debug: {EventDebug: EventDebug}};'))
		.pipe(replace(/module\.exports = CachedEventHandler;/, 'module\.exports = {handlers: {CachedEventHandler: CachedEventHandler}};'))
		
		.pipe(replace(/require\(\'oktopost-plankton\'\).is/, 'plankton.is'))
		.pipe(replace(/require\(\'oktopost-plankton\'\).array/, 'plankton.array'))
		.pipe(replace(/require\(\'oktopost-plankton\'\).func/, 'plankton.func'))
		.pipe(replace(/require\(\'oktopost-plankton\'\).obj/, 'plankton.obj'))
		
		.pipe(replace(/require\('\.\/Classy'\)/, 'duct.Classy'))
		.pipe(replace(/require\('\.\/Event'\)/, 'duct.Event'))
		.pipe(replace(/require\('\.\/Listener'\)/, 'duct.Listener'))
		.pipe(replace(/require\('\.\/Creator'\)/, 'duct.Creator'))
		.pipe(replace(/require\(\'.\/debug\/EventDebug\'\)/, 'duct.debug.EventDebug'))
		
		.pipe(wrap({src: './gulp/web/web-mixin.js.template'}))
		.pipe(gulp.dest('./bin/tmp'));
});


gulp.task('build-web', ['clean-web', 'prepare-web'], () => {
	return gulp.src([
			'./gulp/web/web-prefix.js',
			'./bin/tmp/EventDebug.js',
			'./bin/tmp/Classy.js',
			'./bin/tmp/Event.js',
			'./bin/tmp/Listener.js',
			'./bin/tmp/Creator.js',
			'./bin/tmp/CachedEventHandler.js'
		])
		.pipe(concat('duct.js'))
		.pipe(gulp.dest('./'))
		.pipe(minify())
		.pipe(gulp.dest('./'));
});