var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

var sassLoaders = [
    'css-loader',
    'postcss-loader',
    'sass-loader?indentedSyntax=sass&includePaths[]=' + path.resolve(__dirname, './src')
]

function config() {
    return {
        entry: {
            styles: ["./src/bootstrap4/scss/bootstrap"],
            vendors: ["./src/js"]
        },
        output: {
            path: path.join(__dirname, "public", "assets"),
            filename: '[name].js',
            publicPath: "public/assets/"
        },
        module: {
            loaders: [{
                test: /\.css/,
                loader: 'style!css'
            }, {
                test: /\.scss$/,
                //loader: "style!"+ExtractTextPlugin.extract(sassLoaders.join('!'))
                loader:"style!"+sassLoaders.join('!')
                //loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
            }, {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }, {
                test: /\.(woff2?|ttf|eot|svg|png|jpg|jpeg)$/,
                loader: 'url?limit=10000'
            }]
        },
        plugins: [
            //new webpack.HotModuleReplacementPlugin(),
            //new ExtractTextPlugin('[name].css'),
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery',
                jquery: 'jquery',
                "Tether": 'tether',
                "window.Tether": "tether"
            }),
            new webpack.optimize.CommonsChunkPlugin("vendors", "vendors.js")
        ],
        postcss: [autoprefixer({
            browsers: ['last 2 versions']
        })],
        resolve: {
            extensions: ['', '.js', '.scss'],
            modulesDirectories: ['src', 'node_modules']
        }

    }
}

module.exports = config();
module.exports.clone = config;
