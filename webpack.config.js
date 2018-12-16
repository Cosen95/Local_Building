const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const extractLess = new ExtractTextPlugin({
    filename: "../style/[name].css",
    disable: process.env.NODE_ENV === 'development'
})

module.exports = {
    entry: {
        index: './src/script/index.js',
        vendor: ['react','react-dom']
    },
    output: {
        path: path.resolve(__dirname, 'build/script'),
        filename: '[name].js'
    },
    mode: 'production',
    // optimization: {
    //     usedExports: true
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname,'src/script')
                ],
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                use: extractLess.extract({
                    use: [{
                        loader: 'css-loader' // translates CSS into CommonJS
                      }, {
                        loader: 'less-loader' // compiles Less to CSS
                      }],
                      // use style-loader in development
                    fallback: 'style-loader'
                })
            }
        ]
    },
    plugins: [
        extractLess,
        // new webpack.optimize.CommonsChunkPlugin({
        //     names: ['vendor','runtime'],
        //     // filename: "vendor.js"
        //     // (Give the chunk a different name)
        // })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    chunks: "initial",
                    minChunks: 2
                },
                // runtime: {
                //     name: "runtime",
                //     chunks: "initial",
                //     minChunks: 2
                // }
            }
        }
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
}