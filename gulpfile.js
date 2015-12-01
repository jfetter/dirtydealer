'use strit';

var gulp = require('gulp');
var rimraf = require('rimraf')
var bower = require('gulp-bower');
var gutil = require('gulp-util');
var run = require('gulp-run')
var concat = require('gulp-concat')
var addsrc = require('gulp-add-src');

gulp.task('default', ['watch'])



gulp.task('watch', function() {
	gulp.watch('source/**/*', ['build']);
});

gulp.task('build', ['clean', 'bower'], function(){
	gulp.src('source/**/*.js')
		.pipe(concat("bundle.js"))
		.pipe(addsrc("source/**/*.html"))
		.pipe(gulp.dest('public'))
		.on('error', gutil.log)
})

gulp.task('clean', function(cb) {
	rimraf('public', cb);
})
gulp.task('bower', function(cb) {
	run('bower i').exec(cb)
})
