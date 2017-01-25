var gulp = require('gulp');

var concat = require('gulp-concat');
var typescript = require('gulp-typescript');
var using = require('gulp-using');
var watch = require('gulp-watch');

var tsconfig = require('./tsconfig.json');

var root = '.';
var src = root + '/src/';

function compileTypeScript () {
    gulp.src(src + '**/*.ts')
        .pipe(using())
        .pipe(typescript(tsconfig.compilerOptions))
        .pipe(concat('index.js'))
        .pipe(gulp.dest(root))
}

gulp.task('compile:ts', compileTypeScript);

gulp.task('compile', ['compile:ts']);

gulp.task('default', ['compile']);

gulp.task('watch:ts', function () {
    watch(src + '**/*.ts', compileTypeScript);
});