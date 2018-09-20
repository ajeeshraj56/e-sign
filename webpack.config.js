const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

const extractCSS = new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[name].css"
})

module.exports = {
    entry: './src/index.js',

    resolve: {
        alias: {
            Components: path.resolve(__dirname, 'src/scripts/components'),
            Containers: path.resolve(__dirname, 'src/scripts/containers'),
            Utils: path.resolve(__dirname, 'src/scripts/utils'),
            Assets: path.resolve(__dirname, 'src/assets')
        }
    },

    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        chunkFilename: '[name].js'
    },
    //root: path.resolve('src'),

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        },
        {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS
            ]
        },
        {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader"
            ]
        },
        {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000&name=fonts/[name].[ext]'

        }
        ]
    },

    plugins: [htmlPlugin, extractCSS]
};
