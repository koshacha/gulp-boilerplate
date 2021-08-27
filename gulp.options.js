/*
 * Gulp-tasks arguments in one place.
 */

// Pug (Jade)
export const pugOptions = {
  pretty: true
};

// SASS
export const sassOptions = {
  includePaths: ['src/scss'],
  errLogToConsole: true,
  outputStyle: 'compressed'
};

// SASS (Autoprefixer)
export const autoprefixerOptions = ['last 15 versions'];

// SASS (Remove unused CSS)
export const cleancssOptions = {
  level: { 1: { specialComments: 0 } }
};

// Images optimization
export const imageminOptions = {
  gifsicle: {interlaced: true},
  mozjpeg: {
    quality: 75,
    progressive: true
  },
  optipng: {optimizationLevel: 5},
  svgo: {
    plugins: [
      {removeViewBox: true},
      {cleanupIDs: false}
    ]
  }
};

// JS
export const babelOptions = {
  presets: ['@babel/env']
};