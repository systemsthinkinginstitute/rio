const webpack = require('webpack');

module.exports = {
  entry: ['./index.js'],
  output: {
    filename: 'dist.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        },
      }
    ]
  }
};
