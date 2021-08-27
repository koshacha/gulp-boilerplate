import gulp from 'gulp';
import pug from 'gulp-pug';
import gulpSass from 'gulp-sass';
import nodeSass from "sass";
import imagemin from 'gulp-imagemin';
import cleancss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import inject from 'gulp-inject';
import sync from 'browser-sync';
import {
  pugOptions,
  sassOptions,
  cleancssOptions,
  imageminOptions,
  autoprefixerOptions,
  babelOptions
} from './gulp.options.js';

const browserSync = sync.create();
const sass = gulpSass(nodeSass);

const isProduction = process.env.PRODUCTION === 'Y';

gulp.task('html', () => {
  return gulp.src('src/pug/*.pug')
    .pipe(pug(pugOptions))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', () => {
  if (isProduction) {
    return gulp.src('src/scss/style.scss')
      .pipe(sass(sassOptions))
      .pipe(autoprefixer(autoprefixerOptions))
      .pipe(cleancss(cleancssOptions))
      .pipe(gulp.dest('dist/css'));
  } else {
    return gulp.src('src/scss/style.scss')
      .pipe(sourcemaps.init())
      .pipe(sass(sassOptions))
      .pipe(autoprefixer(autoprefixerOptions))
      .pipe(cleancss(cleancssOptions))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.reload({ stream: true }));
  }
});

gulp.task('images', () => {
  return gulp.src('src/assets/images/**/*')
    .pipe(imagemin([
      imagemin.gifsicle(imageminOptions.gifsicle),
      imagemin.mozjpeg(imageminOptions.mozjpeg),
      imagemin.optipng(imageminOptions.optipng),
      imagemin.svgo(imageminOptions.svgo)
    ]))
    .pipe(gulp.dest('dist/images'));
});

// gulp.task('icons', () => {
//   return gulp.src('src/assets/i/**/*')
//     .pipe(gulp.dest('dist/images/i'));
// });

gulp.task('js', () => {
  if (isProduction) {
    return gulp.src('src/js/*.js')
      .pipe(concat('scripts.js'))
      .pipe(babel(babelOptions))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
  } else {
    return gulp.src('src/js/*.js')
      .pipe(sourcemaps.init())
      .pipe(concat('scripts.js'))
      .pipe(babel(babelOptions))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/js'))
      .pipe(browserSync.reload({ stream: true }));
  }
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
  return gulp.series('css', 'js', 'html', 'inject', 'images');
});

gulp.task('default', () => {
  gulp.watch('src/scss/**/*', gulp.series('css', 'inject'));
  gulp.watch('src/pug/**/*', gulp.series('html', 'inject'));
  gulp.watch('src/js/**/*.js', gulp.series('js', 'inject'));
  gulp.watch('src/assets/images/**/*', gulp.series('images'));
  // gulp.watch('src/assets/i/**/*', gulp.series('icons'));

  browserSync.init({
    server: {
      proxy: "local.build",
      baseDir: "dist/"
    }
  });

  return gulp.watch(['dist/**'], browserSync.reload);
});
