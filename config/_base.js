import { argv } from 'yargs'
import path from 'path'

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const isProd = env === 'production';

let pathBase = path.resolve(__dirname, '../');

let config = {
  env : env,

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base: pathBase,
  path_dist: pathBase + '/dist/resources',
  path_client: pathBase + '/app',
  path_server: pathBase + '/server',
  path_test   : 'tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : 'localhost',
  server_port : process.env.PORT || 5090,
  webpack_port : process.env.PORT || 5091,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_devtool   : !isProd ? 'eval-source-map' : null,
  compiler_enable_hmr: false,
  compiler_public_path: '',

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_enabled   : !argv.watch,
  coverage_reporters : [
    { type : 'text-summary' },
    { type : 'html', dir : 'coverage' }
  ],

  // ------------------------------------
  // Environment
  // ------------------------------------
  globals: {
    'process.env'  : {
      'NODE_ENV' : JSON.stringify(env)
    },
    'NODE_ENV'     : env,
    '__DEV__'      : !isProd,
    '__PROD__'     : isProd,
    '__DEBUG__'    : !isProd,
    '__BASENAME__' : JSON.stringify(process.env.BASENAME || '')
  }

};

export default config;
