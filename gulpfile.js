'use strict';

var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    cleanCSS       = require('gulp-clean-css'),
    autoprefixer   = require('gulp-autoprefixer'),
    webserver      = require('gulp-webserver'),
    concat         = require('gulp-concat'),
    uglify         = require('gulp-uglifyjs'),
    babel          = require('gulp-babel'),
    sourcemaps     = require('gulp-sourcemaps'),
    tslint         = require('gulp-tslint'),
    ts             = require('gulp-typescript'),
    tsProject      = ts.createProject('tsconfig.json',  {
        typescript: require('typescript')
    }),
    paths           = {
        scripts : [
            './node_modules/jquery/dist/jquery.js',
            './src/scripts/tmp/*.js'
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

gulp.task('tslint', () => {
    return gulp.src("src/**/*.ts")
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint.report());
});

gulp.task("compile-ts", ["tslint"], () => {
    let tsResult = gulp.src("src/**/*.ts").pipe(tsProject());
    return tsResult.pipe(gulp.dest("./src/scripts"));
});

gulp.task('compile-js', ["compile-ts"], function() {
    gulp.src(paths.scripts)
        .pipe(concat('main.js'))
        // .pipe(babel({
        //     presets: ['es2015']
        // }))
        // .pipe(uglify())
        .pipe(gulp.dest('./app/dist/js/'));
});

gulp.task('watch-js', function() {
    gulp.watch('./src/scripts/*.ts', ['compile-js']);
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
