/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');

const rootPath = __dirname;

module.exports = {
  devtool: 'eval-source-map',
  entry: ['./playground/index.js'],
  output: {
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.js.map',
    path: '/',
    publicPath: '/assets/'
  },
  devServer: {
    hot: true
  },
  mode: 'development',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  module: {
    rules: [
      {
        test: /\.jsx$/,
        include: path.join(rootPath, 'playground'),
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react']
        }
      }
    ]
  }
};
/* eslint-enable import/no-extraneous-dependencies */
