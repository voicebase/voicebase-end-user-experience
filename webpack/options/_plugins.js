import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin'

import config from '../../config'

const isProduction = config.env === 'production';

let htmlWebpackOptions = {
  template: `${config.path_client}/index.html`,
  hash: false,
  favicon: `${config.path_client}/static/favicon.ico`,
  filename: !isProduction ? 'index.html': '../index.html',
  inject: 'body'
};

if (isProduction) {
  htmlWebpackOptions.minify = {
    collapseWhitespace: true
  }
}

export let plugins = [
  new webpack.DefinePlugin(config.globals),
  new webpack.DllReferencePlugin({
    context: `${config.path_client}`,
    manifest: require(config.path_dist + "/vendor-manifest.json")
  }),
  new HtmlWebpackPlugin(htmlWebpackOptions),
  new AddAssetHtmlPlugin({ filename: require.resolve(`${config.path_dist}/dll.vendor.js`), includeSourcemap: false })
];

if (!isProduction) {
  plugins = plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]);
}
else {
  plugins = plugins.concat([
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    }),
    new ExtractTextPlugin('[name].css')
  ]);
}
