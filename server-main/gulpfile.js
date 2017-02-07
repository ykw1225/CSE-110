let gulp = require('gulp');

let typescript = require('gulp-typescript');

let tsconfig = require('./tsconfig.json');

gulp.task('compile:ts', function () {
    return gulp.src(['./frontend-src/**/*.ts'])
            .pipe(typescript(tsconfig.compileOptions))
            .pipe(gulp.dest('public'));
});

gulp.task('compile', ['compile:ts']);

gulp.task('default', ['compile']);