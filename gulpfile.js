var builder = require('gulp-nw-builder');
var gulp = require('gulp');
 
gulp.task('build', function() {
  return gulp.src(['./**/*'])
    .pipe(builder({
        version: 'v0.12.2',
        platforms: ['osx64']
     }));
});