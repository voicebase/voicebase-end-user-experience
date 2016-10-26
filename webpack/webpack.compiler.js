import webpack from 'webpack'
import config from '../config'
import webpackConfig from './webpack.config'
import fs from 'fs-extra'

const compiler = webpack(webpackConfig);

compiler.run((err, stats) => {
  console.log(stats.toString({
    chunks : false,
    chunkModules : false,
    colors : true
  }));

  const jsonStats = stats.toJson();

  if (err) {
    console.log('Webpack compiler encountered a fatal error.', err);
    process.exit(1);
  }
  else if (jsonStats.errors.length > 0) {
    console.log('Webpack compiler encountered errors.');
    process.exit(1);
  }
  else if (jsonStats.warnings.length > 0) {
    console.log('Webpack compiler encountered warnings.');
    process.exit(1);
  }
  else {
    console.log('No errors or warnings encountered.')
  }

  console.log('Copy static assets to dist folder.');
  fs.copySync(`${config.path_client}/static`, config.path_dist)
});
