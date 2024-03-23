import gulp from 'gulp';
import pug from 'gulp-pug';
import imagemin from 'gulp-imagemin';
import cleancss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import inject from 'gulp-inject';
import {
  isDevelopment,
  isProduction,
  setProductionEnvironment,
  setDevelopmentEnvironment,
} from 'gulp-node-env';
import $if from 'gulp-if';
import gulpSass from 'gulp-sass';
import * as nodeSass from 'sass';
import sync from 'browser-sync';
import options from './gulpfile.options.js';

const { src, dest, series, watch } = gulp;
const sass = gulpSass(nodeSass);
const browserSync = sync.create();

export const html = () => {
  return src('src/pages/*.pug').pipe(pug(options.pug)).pipe(dest('dist'));
};

export const styles = () => {
  return src('src/styles/style.scss')
    .pipe($if(isDevelopment(), sourcemaps.init()))
    .pipe(sass(options.sass))
    .pipe(autoprefixer(options.autoprefixer))
    .pipe(cleancss(options.cleanCss))
    .pipe($if(isDevelopment(), sourcemaps.write()))
    .pipe(dest('dist/css'))
    .pipe($if(isDevelopment(), browserSync.reload({ stream: true })));
};

export const imageOptimisation = () => {
  return src('src/assets/images/**/*')
    .pipe(
      imagemin([
        imagemin.mozjpeg(options.mozjpeg),
        imagemin.optipng(options.optipng),
        imagemin.svgo(options.svgo),
      ]),
    )
    .pipe(dest('dist/images'));
};

export const scripts = () => {
  return src('src/scripts/*.js')
    .pipe($if(isDevelopment(), sourcemaps.init()))
    .pipe(concat('app.js'))
    .pipe(babel(options.scripts))
    .pipe($if(isProduction(), uglify()))
    .pipe($if(isDevelopment(), sourcemaps.write()))
    .pipe(dest('dist/scripts'))
    .pipe($if(isDevelopment(), browserSync.reload({ stream: true })));
};

export const injection = () => {
  return src('dist/**/*.html')
    .pipe(
      inject(gulp.src(['dist/**/*.js', 'dist/**/*.css'], { read: false }), {
        ignorePath: 'dist',
      }),
    )
    .pipe(gulp.dest('dist'));
};

export const build = series(
  setProductionEnvironment,
  styles,
  scripts,
  html,
  injection,
  imageOptimisation,
);

export const devBuild = series(
  setDevelopmentEnvironment,
  styles,
  scripts,
  html,
  injection,
  imageOptimisation,
);

export default () => {
  watch('src/styles/**/*', series(styles));
  watch('src/scripts/**/*.js', series(scripts));
  watch('src/(pages|components)/**/*', series(html, injection));
  watch('src/assets/images/**/*', imageOptimisation);

  browserSync.init({
    server: {
      baseDir: 'dist/',
    },
  });

  return watch(['dist/**'], browserSync.reload);
};
