'use strict';

var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    cleanCSS       = require('gulp-clean-css'),
    autoprefixer   = require('gulp-autoprefixer'),
    webserver      = require('gulp-webserver'),
    concat         = require('gulp-concat'),
    uglify         = require('gulp-uglifyjs'),
    babel          = require('gulp-babel'),
    paths          = {
        scripts : [
            './src/scripts/main.js'
        ]
    };

gulp.task('compile-scss', function() {
    gulp.src('src/styles/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({advanced : false}))
        .pipe(gulp.dest('./app/dist/css/'));
});

gulp.task('watch-scss', function() {
    gulp.watch('src/styles/*.scss', ['compile-scss']);
});

gulp.task('compile-js', function() {
    gulp.src(paths.scripts)
        .pipe(concat('main.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('./app/dist/js/'));
});

gulp.task('watch-js', function() {
    gulp.watch(paths.scripts, ['compile-js']);
});

gulp.task('webserver', function() {
    gulp.src('app')
        .pipe(webserver({
            livereload: true,
            fallback: "index.html",
            port: 8080,
            open: true
        }));
});

gulp.task('default', ['webserver', 'compile-scss', 'watch-scss', 'compile-js', 'watch-js'] );
