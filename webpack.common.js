const HtmlWebpackPlugin         = require('html-webpack-plugin');
const { CleanWebpackPlugin }    = require('clean-webpack-plugin');
const Dotenv                    = require('dotenv-webpack');
const MiniCssExtractPlugin      = require("mini-css-extract-plugin");
const path                      = require('path');

module.exports = {
    entry: "./src/index.js",
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Badge Print App',
            template: './src/index.ejs'
        }),
        new Dotenv({
            expand: true
        })
    ],
    node: {fs: 'empty'},
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            fonts: path.resolve(__dirname, 'src/styles/fonts')
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
                                { "targets": { "node": "current" } }
                            ],
                            '@babel/preset-react',
                            '@babel/preset-flow'
                        ],
                        plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.less/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
            },
            {
                test: /\.scss/,
                use: [MiniCssExtractPlugin.loader, "css-loader?modules=true&localsConvention=camelCase", 'sass-loader'],
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
