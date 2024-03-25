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
  isTest,
  setProductionEnvironment,
  setDevelopmentEnvironment,
  setTestEnvironment,
} from 'gulp-node-env';
import $if from 'gulp-if';
import gulpSass from 'gulp-sass';
import * as nodeSass from 'sass';
import sync from 'browser-sync';
import options from './gulp.options.js';

const { src, dest, series, watch } = gulp;
const sass = gulpSass(nodeSass);
const browserSync = sync.create();

const getDestDir = (isTest) => {
  return isTest ? 'test-build' : 'dist';
};

export const html = () => {
  const outDir = getDestDir(isTest());
  return src('src/pages/*.pug').pipe(pug(options.pug)).pipe(dest(outDir));
};

export const styles = () => {
  const outDir = getDestDir(isTest());
  return src('src/styles/**/*.scss')
    .pipe($if(isDevelopment(), sourcemaps.init()))
    .pipe(sass(options.sass))
    .pipe(autoprefixer(options.autoprefixer))
    .pipe(cleancss(options.cleanCss))
    .pipe($if(isDevelopment(), sourcemaps.write()))
    .pipe(dest(`${outDir}/css`));
};

export const imageOptimisation = () => {
  const outDir = getDestDir(isTest());
  return src('src/assets/images/**/*')
    .pipe(
      imagemin([
        imagemin.mozjpeg(options.mozjpeg),
        imagemin.optipng(options.optipng),
        imagemin.svgo(options.svgo),
      ]),
    )
    .pipe(dest(`${outDir}/images`));
};

export const scripts = () => {
  const outDir = getDestDir(isTest());
  return src('src/scripts/*.js')
    .pipe($if(isDevelopment(), sourcemaps.init()))
    .pipe(concat('app.js'))
    .pipe(babel(options.scripts))
    .pipe($if(isProduction(), uglify()))
    .pipe($if(isDevelopment(), sourcemaps.write()))
    .pipe(dest(`${outDir}/scripts`));
};

export const injection = () => {
  const outDir = getDestDir(isTest());

  return src(`${outDir}/**/*.html`)
    .pipe(
      inject(
        gulp.src([`${outDir}/**/*.js`, `${outDir}/**/*.css`], { read: false }),
        {
          ignorePath: outDir,
        },
      ),
    )
    .pipe(gulp.dest(outDir));
};

export const build = series(
  styles,
  scripts,
  html,
  injection,
  imageOptimisation,
);

export const prodBuild = series(setProductionEnvironment, build);
export const devBuild = series(setDevelopmentEnvironment, build);
export const testBuild = series(setTestEnvironment, build);

export default () => {
  function reload(done) {
    browserSync.reload();
    done();
  }

  watch('src/styles/**/*', series(styles));
  watch('src/scripts/**/*.js', series(scripts));
  watch('src/(pages|components)/**/*', series(html, injection));
  watch('src/assets/images/**/*', imageOptimisation);

  browserSync.init({
    server: {
      baseDir: 'dist/',
    },
  });

  return watch(['dist/**'], reload);
};
