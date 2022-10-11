const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const path = require('path')

module.exports = {
  entry: "./src/index.js",
  plugins: [
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Badge Print App',
      template: './src/index.ejs'
    }),
    new Dotenv({
      expand: true
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      fonts: path.resolve(__dirname, 'src/styles/fonts')
    },
    mainFields: ['browser', 'module', 'main'],
    fallback: {
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve("buffer"),
      fs: require.resolve('fs'),
      process: require.resolve("process"),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                "@babel/preset-env",
                {"targets": {"node": "current"}}
              ],
              '@babel/preset-react',
              '@babel/preset-flow'
            ],
            plugins: [
              "@babel/plugin-proposal-object-rest-spread",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-nullish-coalescing-operator",
              "@babel/plugin-transform-arrow-functions",

            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.less/,
        exclude: /\.module\.less/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
      },
      {
        test: /\.scss/,
        exclude: /\.module\.scss/,
        use: [MiniCssExtractPlugin.loader, "css-loader", 'sass-loader'],
      },
      {
        test: /\.module.less/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
            }
          },
          { loader: "less-loader" },
        ]
      },
      {
        test: /\.module.scss/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
            }
          },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "url-loader?limit=10000&minetype=application/font-woff&name=fonts/[folder]/[name].[ext]"
      },
      {
        test: /\.(ttf|eot|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "file-loader?name=fonts/[folder]/[name].[ext]"
      },
      {
        test: /\.jpg|\.png|\.svg|\.gif$/,
        use: "file-loader?name=images/[path][name].[ext]"
      },
      {
        test: /\.yaml$/,
        use: 'js-yaml-loader',
      }
    ]
  },
};
