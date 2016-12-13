var gulp = require('gulp');
var pug = require('gulp-pug');
var del = require('del');
var runSequence  = require('run-sequence');
var ghPages = require('gulp-gh-pages');

// gh-pages
gulp.task('deploy', function() {
  return gulp.src('build/**/*')
    .pipe(ghPages());
});

// pug
gulp.task('pug', function(){
  return gulp.src(['app/pug/*.pug'])
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build/'))

});

// Cleaning
gulp.task('clean', function(){
  return del(['build/**/*']);
});

gulp.task('watch', function(){
  gulp.watch('app/pug/**/*.pug', ['pug']);
});

// Build Sequence
// -------------------

gulp.task('default', function(){
  runSequence('watch', ['pug']);
});

gulp.task('build', function(){
  runSequence('clean', ['pug'], 'deploy');
});
