"use strict";

let gulp = require('gulp');

let sourcemaps = require('gulp-sourcemaps');
let typescript = require('gulp-typescript');
let using = require('gulp-using');
let watch = require('gulp-watch');

let tsconfig = require('./tsconfig.json');

function compileTypeScript() {
    return gulp.src(tsconfig.include)
            .pipe(using())
            .pipe(sourcemaps.init())
            .pipe(typescript(tsconfig.compilerOptions))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('public'));
}

gulp.task('compile:ts', function () {
    return compileTypeScript();
});

gulp.task('compile', ['compile:ts']);

gulp.task('watch:ts', function () {
    watch('./frontend-src/**/*.ts', compileTypeScript);
});

gulp.task('watch', ['watch:ts']);

gulp.task('default', ['compile']);
