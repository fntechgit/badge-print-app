const {sentryWebpackPlugin} = require("@sentry/webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const path = require('path')

module.exports = {
  entry: "./src/index.js",

  plugins: [
    new Dotenv({
      expand: true
    }), // Work around for Buffer is undefined:
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
    // upload source maps only if we have an sentry auth token and we are at production
    ...("SENTRY_AUTH_TOKEN" in process.env && process.env.NODE_ENV === "production") ?[
      new SentryWebpackPlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        ignore: ["app-*", "polyfill-*", "framework-*", "webpack-runtime-*", "~partytown"],
        // Specify the directory containing build artifacts
        include: [
          {
            paths: ["src","public",".cache"],
            urlPrefix: "~/",
          },        
          {
            paths: ["node_modules/openstack-uicore-foundation/lib"],
            urlPrefix: "~/node_modules/openstack-uicore-foundation/lib",
          }
        ],
        // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
        // and needs the `project:releases` and `org:read` scopes
        authToken: process.env.SENTRY_AUTH_TOKEN,
        // Optionally uncomment the line below to override automatic release name detection
        release: process.env.SENTRY_RELEASE,
      })]:[],
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'fonts': path.resolve(__dirname, 'src/styles/fonts')
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
              modules: {
                auto: true,
                exportLocalsConvention: "camelCase",
              },
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
              modules: {
                auto: true,
                exportLocalsConvention: "camelCase",
              },
              url: false
            }
          },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(jpg|png|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.svg/,
        use: "file-loader?name=svg/[hash][name].[ext]"
      },
      {
        test: /\.yaml$/,
        use: 'js-yaml-loader',
      }
    ]
  },

  devtool: "source-map"
};