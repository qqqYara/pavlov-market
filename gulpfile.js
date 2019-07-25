var gulp = require('gulp');
// подключаем gulp-sass
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

var useref = require('gulp-useref');
// minify JS
var uglify = require('gulp-uglify');
// minify CSS
var minifyCSS = require('gulp-minify-css');
// другие подключения...
var gulpIf = require('gulp-if');
// optimize Images
var imagemin = require('gulp-imagemin');

var webserver = require('gulp-webserver');

var connect = require('gulp-connect');

//----------------------------------------
gulp.task('html', function() {
  return gulp.src('app/templates/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    })) 
});

gulp.task('sass', function() {
  return gulp.src('app/static/sass/*.scss')
 .pipe(sass())
 .pipe(gulp.dest('dist/static/css'))
 .pipe(browserSync.reload({
 stream: true
 }))
});

gulp.task('images', function(){
  return gulp.src('app/static/images/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(gulp.dest('dist/static/images'))
});

gulp.task('fonts', function(){
  return gulp.src('app/static/fonts/*')
  .pipe(gulp.dest('dist/static/fonts'))
});


gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
  })
})

gulp.task('watch', ['browserSync', 'html', 'sass', 'images', 'fonts'], function (){
  gulp.watch('app/templates/*.html', ['html']);
  gulp.watch('app/static/sass/**/*.scss', ['sass']); 
  gulp.watch('app/static/images/*.+(png|jpg|jpeg|gif|svg)', ['images']);
  gulp.watch('app/static/fonts/*', ['fonts']);
  gulp.watch('app/static/js/**/*.js', browserSync.reload);
})

//----------------------------------------

gulp.task('useref', function(){
  var assets = useref.assets();

  return gulp.src('app/*.html')
 .pipe(assets)
 // Минифицируем только CSS файлы
 .pipe(gulpIf('*.css', minifyCSS()))
 // Uglifies only if it's a Javascript file
 .pipe(gulpIf('*.js', uglify()))
 .pipe(assets.restore())
 .pipe(useref())
 .pipe(gulp.dest('dist'))
});



gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

//----------------------------------------

gulp.task('connect', function() {
  connect.server();
});

gulp.task('default', ['connect']);
 
gulp.task('webserver', function() {
  gulp.src('app/templates')
    .pipe(webserver({
      port: 3000,
      livereload: true,
      directoryListing: true,
      open: true
    }));
});