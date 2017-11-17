var gulp          = require("gulp"),
    include       = require("gulp-include");
 
gulp.task("flats-include", function() {
  console.log("-- gulp is running task 'scripts'");
 
  gulp.src("flats/flats.html")
    .pipe(include({
      extensions: 'svg'
    }))
      .on('error', console.log)
    .pipe(gulp.dest(""));
});
 

gulp.task('watch-flats', ['flats-include'], function() {
  gulp.watch('flats/flats.html', ['flats-include']);
});
