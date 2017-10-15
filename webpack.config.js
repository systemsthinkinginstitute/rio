const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    'rio.js': './src/rio.ts',
    'rio.min.js': './src/rio.ts',
  },
  output: {
    filename: '[name]',
    libraryTarget: 'umd'
  },
  plugins: [
    new UglifyJSPlugin({
      minimize: true,
      include: /\.min\.js$/
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  }
};



