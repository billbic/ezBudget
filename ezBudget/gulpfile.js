/// <binding AfterBuild='default' />
var gulp = require('gulp'),
    sass = require('gulp-sass');

gulp.task('build-css', function () {
    return gulp
        .src('./SASS/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./CSS'));
});

// Default Task
gulp.task('default',['build-css']);