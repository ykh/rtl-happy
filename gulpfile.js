var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    es = require('event-stream'),
    mkdirp = require('mkdirp'),
    addsrc = require('gulp-add-src'),
    css2js = require("gulp-css2js");

/**
 * Make a Bundle from 'rtl-happy.js'
 */
gulp.task('build:rtl-happy', function () {
    return browserify('src/rtl-happy.js')
        .bundle()
        .pipe(source('rtl-happy.js'))
        .pipe(buffer())
        .pipe(rename('rtl-happy.min.js'))
        .pipe(gulp.dest('./tmp'))
        .pipe(addsrc('./src/user-script-init.js'))
        .pipe(concat('rtl-happy-userscript.js'))
        .pipe(gulp.dest('./dist'));
});

/**
 * Build Use Direct Distribution
 */
gulp.task('build:useDirect', [], function () {
    var cssSrc = [
        './src/assets/css/style.css',
        './src/assets/css/style.phab.css',
        './src/assets/css/style.jira.css'
    ];

    return gulp.src(cssSrc)
        .pipe(css2js())
        .pipe(concat('inject-styles.js'))
        .pipe(addsrc('./tmp/rtl-happy.min.js'))
        .pipe(concat('rtl-happy.js'))
        .pipe(uglify())
        .pipe(rename('rtl-happy.min.js'))
        .pipe(gulp.dest("./dist/use-direct/"))
});

/**
 * Copy Extension Files & Requirements
 */
gulp.task('copy', function (cb) {
    var streams = [];

    var _src = [
        {
            'src': [
                './src/extension/**',
                './src/assets/css/**',
                './tmp/rtl-happy.min.js'
            ],
            'dest': './dist/extension'
        },
        {
            'src': [
                './src/vendor/**'
            ],
            'dest': './dist/extension/vendor'
        },
        {
            'src': [
                './src/test-use-direct-dist.html'
            ],
            'dest': './dist/use-direct'
        }
    ];

    // Create 'extension' Directory inside 'dist'
    mkdirp('./src/extension', function (err) {
        if (err) {
            console.error(err);
        }
    });

    _src.map(function (source) {
        var options = {};

        if (source.base) {
            options.base = source.base;
        }

        streams.push(
            gulp.src(source.src, options)
                .pipe(gulp.dest(source.dest))
        );
    });

    //return streams;
    return es.merge(streams);
});

/**
 * Build
 */
gulp.task('build', [], function (cb) {
    runSequence('build:rtl-happy', 'build:useDirect', 'copy', cb);
});

/**
 * Watch
 */
gulp.task('watch', ['build'], function () {
    var _src = [
        './src/**',
        '!./src/vendor'
    ];

    gulp.watch(_src, ['build']);
});

/**
 * Default Task
 */
gulp.task('default', ['watch']);