/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');

const rootPath = __dirname;

module.exports = {
  entry: ['./playground/index.js'],

  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: path.join(rootPath, 'site')
  },

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
