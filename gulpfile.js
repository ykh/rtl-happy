var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    addsrc = require('gulp-add-src');

/**
 * Build
 */
gulp.task('build', function () {
    return browserify('src/rtl-happy.js')
        .bundle()
        .pipe(source('rtl-happy.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename('rtl-happy.min.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(addsrc('./src/user-script-init.js'))
        .pipe(concat('rtl-happy-userscript.js'))
        .pipe(gulp.dest('./dist'));
});

/**
 * Watch and Build
 */
gulp.task('watch', ['build'], function () {
    gulp.watch('src/rtl-happy.js', ['build']);
});

/**
 * Default Task
 */
gulp.task('default', ['watch']);