"use strict";

let gulp = require('gulp');

let sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify');
let watch = require('gulp-watch');
let webpack = require('gulp-webpack');

function compileTypeScript() {
    return gulp.src("./frontend-src")
        .pipe(sourcemaps.init())
        .pipe(webpack({
            entry: {
                app: './frontend-src/main.ts',
            },
            output: {
                filename: '[name].js'
            },
            resolve: {
                extensions: ['', 'webpack.js', 'web.js', '.ts', '.js'],
            },
            module: {
                loaders: [
                    { test: /\.ts$/, loader: 'ts-loader' }
                ]
            }
        }))
        .pipe(sourcemaps.write())
        //.pipe(uglify())
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
