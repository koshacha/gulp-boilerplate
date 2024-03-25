import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  /** @type import('pug').Options */
  pug: {
    pretty: true,
    basedir: join(__dirname, 'src'),
  },

  /** @type import('node-sass').Options */
  sass: {
    includePaths: ['node_modules/normalize.css', 'node_modules/gerillass/scss'],
    errLogToConsole: true,
    outputStyle: 'compressed',
  },

  /** @type Parameters<import('gulp-babel')>[0] */
  scripts: {
    presets: ['@babel/env'],
  },

  /** @type import('gulp-autoprefixer').Options */
  autoprefixer: ['last 15 versions'],

  /** @type import('gulp-clean-css').Details */
  cleanCss: {
    level: { 1: { specialComments: 0 } },
  },

  /** @type import('imagemin-mozjpeg').Options */
  mozjpeg: {
    quality: 95,
    progressive: true,
  },

  /** @type import('imagemin-optipng').Options */
  optipng: { optimizationLevel: 5 },

  /** @type import('imagemin-svgo').Options */
  svgo: {
    plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
  },
};
