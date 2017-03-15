"use strict";

let gulp = require('gulp');

let webpack = require('gulp-webpack');
let sourcemaps = require('gulp-sourcemaps');
let typescript = require('gulp-typescript');
let using = require('gulp-using');
let watch = require('gulp-watch');
let uglify = require('gulp-uglify');

let tsconfig = require('./tsconfig.json');

function compileTypeScript() {
    return gulp.src("./frontend-src")
        //.pipe(using())
        .pipe(sourcemaps.init())
        //.pipe(typescript(tsconfig.compilerOptions))
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
        .pipe(uglify())
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
