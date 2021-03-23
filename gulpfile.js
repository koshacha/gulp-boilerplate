const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const cleancss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const inject = require('gulp-inject');
const debug = require('gulp-debug');
const browserSync = require('browser-sync').create();

gulp.task('html', () => {
  return gulp.src('src/pug/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', () => {
  return gulp.src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['src/scss'],
      errLogToConsole: true,
      outputStyle: 'compressed',
      onError: browserSync.notify
    }))
    .pipe(rename({ suffix: '.min', prefix : '' }))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp.src('src/assets/images/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('icons', () => {
  return gulp.src('src/assets/i/**/*')
    .pipe(gulp.dest('dist/images/i'));
});

gulp.task('scripts', () => {
  return gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.min.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('inject', () => {
  return gulp.src('dist/**/*.html')
    .pipe(inject(gulp.src([
      'dist/**/*.js',
      'dist/**/*.css'
    ], {
      read: false,
      ignorePath: 'dist'
    }), {
      ignorePath: 'dist'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', () => {
  return gulp.series('styles', 'scripts', 'html', 'inject', 'images', 'icons');
});

gulp.task('default', () => {
  gulp.watch('src/scss/**/*', gulp.series('styles', 'inject'));
  gulp.watch('src/pug/**/*', gulp.series('html', 'inject'));
  gulp.watch('src/js/**/*.js', gulp.series('scripts', 'inject'));
  gulp.watch('src/assets/images/**/*', gulp.series('images'));
  gulp.watch('src/assets/i/**/*', gulp.series('icons'));

  browserSync.init({
    server: {
      proxy: "local.build",
      baseDir: "dist/"
    }
  });

  return gulp.watch(['dist/**'], browserSync.reload);
});
