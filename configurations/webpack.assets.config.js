'use strict';

// pull in the 'path' module from node
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// export the configuration as an object
module.exports = {
  // development mode will set some useful defaults in webpack
  mode: 'development',
  // For prod use source-map
  devtool: 'cheap-module-source-map',
  // the entry point is the top of the tree of modules.
  // webpack will bundle this file and everything it references.
  entry: './src/core/App.tsx',
  // we specify we want to put the bundled result in the matching build/ folder
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../build/assets'),
  },
  plugins: [
    // Removes the previous build to ensure there are no left-overs
    new CleanWebpackPlugin(),
    // Copies the html file to the build folder
    new HtmlWebpackPlugin({
      template: './assets/index.html',
    }),
    // Runs TS checks in parallel to speed up the build
    new ForkTsCheckerWebpackPlugin({
      async: true,
    }),
  ],
  module: {
    // rules tell webpack how to handle certain types of files
    rules: [
      // Compile scss into css and load it with import syntax
      {
        test: /\.s?css$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      // .ts and .tsx files get passed to ts-loader
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(png|jpe?g|gif|bmp|svg|pdf)$/,
        type: 'asset/resource',
        generator: {
          filename: './images/[name].[hash][ext][query]',
        },
      },
    ],
  },
  resolve: {
    // specify certain file extensions to get automatically appended to imports
    // ie we can write `import 'index'` instead of `import 'index.ts'`
    extensions: ['.ts', '.tsx', '.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'build/assets'),
    compress: true,
    port: 9000,
  },
};