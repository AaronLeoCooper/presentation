var path = require('path');
var del = require('del');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// set variable via $ gulp --type production
var environment = $.util.env.type || 'development';
var isProduction = environment === 'production' || environment === 'prod';

var port = $.util.env.port || 1337;
var app = 'app/';
var dist = 'public/';

var autoprefixerBrowsers = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10',
];

gulp.task('styl', function (cb) {
  return gulp.src(app + 'styl/main.styl')
    .pipe(isProduction ? $.plumber() : $.util.noop())
    .pipe($.stylus({
      compress: isProduction,
      'include css': true,
    }))
    .pipe($.autoprefixer({ browsers: autoprefixerBrowsers }))
    .pipe(gulp.dest(dist + 'css/'))
    .pipe($.size({ title: 'css' }))
    .pipe($.connect.reload());
});

gulp.task('html', function () {
  return gulp.src(app + '*.html')
    .pipe(isProduction ? $.plumber() : $.util.noop())
    .pipe(gulp.dest(dist))
    .pipe($.size({ title: 'html' }))
    .pipe($.connect.reload());
});

gulp.task('images', function (cb) {
  return gulp.src(app + 'images/**/*.{png,jpg,jpeg,gif}')
    .pipe(isProduction ? $.plumber() : $.util.noop())
    .pipe($.size({ title: 'images' }))
    .pipe(gulp.dest(dist + 'images/'));
});

gulp.task('vendor', function () {
  return gulp.src(app + 'vendor/**/*')
    .pipe(isProduction ? $.plumber() : $.util.noop())
    .pipe(gulp.dest(dist + 'vendor/'))
    .pipe($.size({ title: 'vendor' }))
    .pipe($.connect.reload());
});

gulp.task('scripts', function () {
  return gulp.src(app + 'scripts/**/*')
    .pipe(isProduction ? $.uglify() : $.util.noop())
    .pipe(gulp.dest(dist + 'js/'))
    .pipe($.size({ title: 'js' }))
    .pipe($.connect.reload());
});

gulp.task('serve', function () {
  $.connect.server({
    root: dist,
    port: port,
    livereload: {
      port: 35729,
    },
  });
});

gulp.task('clean', function (cb) {
  return del([dist], { force: true }, cb);
});

gulp.task('watch', function () {
  gulp.watch(app + 'styl/*.styl', ['styl']);
  gulp.watch(app + '*.html', ['html']);
  gulp.watch(app + 'scripts/**/*.js', ['scripts']);
  gulp.watch(app + 'images/**/*.*', ['images']);
  gulp.watch(app + 'vendor/**/*.*', ['vendor']);
});

gulp.task('default', ['images', 'vendor', 'html', 'styl', 'scripts', 'serve', 'watch']);
gulp.task('build', ['clean'], function () {
  gulp.start(['images', 'vendor', 'html', 'styl', 'scripts']);
});
