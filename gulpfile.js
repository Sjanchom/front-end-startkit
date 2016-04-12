'use strict';

var gulp = require('gulp'),
    path = require('path'),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    webpackConfig = require('./webpack.config'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

var sassLoaders = [
    'css-loader',
    'postcss-loader',
    'sass-loader?indentedSyntax=sass&includePaths[]=' + path.resolve(__dirname, './src')
]

function setConfig(config, callback) {
    const complier = webpack(config);

    complier.run((err, stats) => {
        if (err) {
            console.error(err);
            return
        }
        console.log(stats.toString({
            colors: true,
            exclude: ["node_modules", "bower_components", "jam", "components"]
        }));
        callback();
    })
}

gulp.task("dev", callback => {
    setConfig(createDevConfig(), callback);
});

gulp.task("prod", callback => {
    setConfig(createProdConfig(), callback);
});


gulp.task("dev:watch", callback => {
    const config = createDevConfig();

    config.output.publicPath = "http://localhost:8888/";
    config.plugins.push(new webpack.HotModuleReplacementPlugin());


    for (let entryName in config.entry) {
        if (!config.entry.hasOwnProperty(entryName)) {
            continue;
        }

        let entryItems = config.entry[entryName];
        if (typeof(entryItems) === "string") {
            entryItems = config.entry[entryName] = [entryItems]
        }

        entryItems.splice(0, 0, "webpack-dev-server/client", "webpack/hot/only-dev-server");
    }

    const complier = webpack(config);
    const devServer = new WebpackDevServer(complier, {
        hot: true,
        inline: true,
        stats: {
            colors: true,
            exclude: ["node_modules", "bower_components", "jam", "components"]
        }
    });

    devServer.listen(8888, "localhost", () => {
        console.log('Dev server started!');
    });
});



function createDevConfig() {
    const config = webpackConfig.clone();
    config.devtool = "cheap-module-eval-source-map";
    config.plugins.push(new webpack.DefinePlugin({
        env: '"dev"'
    }));
    return config;
}

function createProdConfig() {
    const config = webpackConfig.clone();


    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
    config.plugins.push(new webpack.DefinePlugin({
        env: '"prod"'
    }));
    config.plugins.push(new ExtractTextPlugin('[name].css'));
    config.module.loaders[0].loader = ExtractTextPlugin.extract("css");
    config.module.loaders[1].loader = ExtractTextPlugin.extract(sassLoaders.join('!'));
    return config;
}
