/*
 * @Author: pwz
 * @Date: 2020-09-24 21:46:05
 * @LastEditors: pwz
 * @LastEditTime: 2020-10-14 14:38:27
 * @FilePath: \indexeddb-filter\webpack.config.js
 */
const TerserPlugin = require('terser-webpack-plugin') // 引入压缩插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');


module.exports = {
    mode: 'none', // 因为默认是production 默认会进行压缩
    //productionSourceMap: false,
    entry: {
        "indexed-filter": "./src/index.js",
        "indexed-filter.min": "./src/index.js"
    },
    devtool: 'source-map',
    //devtool: 'inline-source-map',
    amd: {
        toUrlUndefined: true
    },
    //mode: "production",
    output: {
        filename: "[name].js",
        library: "indexedFilter",
        libraryExport: "default", // 不添加的话引用的时候需要 tools.default
        libraryTarget: "umd",
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        }
    },
    devServer: {
        contentBase: './dist',
        port: 8088,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({ // 使用压缩插件
                include: /\.min\.js$/
            }),
            //new UglifyJsPlugin(),//压缩插件
            // new webpack.DefinePlugin({//帮助第三方库切换到生产环境模式
            //     'process.env.NODE_ENV': JSON.stringify('production')
            // })
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        //new webpack.HotModuleReplacementPlugin(),

    ],
    module: {
        rules: [
            {test:/\.js$/,use:'babel-loader',exclude:/node_modules/} 
            // {
            //     test: /\.js$/,
            //     use: [{
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['es2015']
            //         }
            //     }]
            // }

            //   {
            //     test: /\.js$/,
            //     exclude: /(node_modules|bower_components)/,
            //     loader: 'babel-loader'
            //   }
        ]
    }
}