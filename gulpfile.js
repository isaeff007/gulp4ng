var gulp = require('gulp');
var connect = require('gulp-connect');

var paths = {
    root: 'app/'
}

gulp.task('connect', function(){
    connect.server({
    root: paths.root,
    port: 4000
  });
});