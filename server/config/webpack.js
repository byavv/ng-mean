var path = require('path'),
    webpack = require('webpack'),
    SaveHashes = require('assets-webpack-plugin'),
    BowerWebpackPlugin = require("bower-webpack-plugin"),
    NgAnnotatePlugin = require("ng-annotate-webpack-plugin");

module.exports = function (config) {
    var webpackConfig = {
        entry: {
            main: ['./client/app/app.module.ts'],
            vendors: ['angular', 'lodash', "jquery", "bootstrap"]
        },
        output: {           
            path: path.join(__dirname, './build'),
            filename: '[name].js',            
            publicPath: '/build/',
            pathinfo: false
        },
        noParse: [
            path.join("node_modules", '/angular'),
            path.join("node_modules", '/angular-route'),
            path.join("node_modules", '/angular-mocks'),
            path.join("node_modules", '/lodash'),
            path.join("node_modules", '/angular-animate'),
            path.join("node_modules", '/angular-messages')
        ],
        module: {
            loaders: [
                { test: /\.html$/, loader: "ng-cache-loader" },
                { test: /\.css$/, loader: "style!css" },
                { test: /\.less$/, loader: "style!css!less" },
                { test: /\.scss$/, loader: "style!css!sass" },
                { test: /\.(png|jpg)$/, loader: "url?limit=25000" },
                { test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3$|\.otf$/, loader: "file"},
                { test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" },
                { test: /\.ts$/, loader: 'ts', exclude: [/node_modules/]}
            ],
            postLoaders: []
        },
        resolve: {
            extensions: ["", ".ts", ".js", ".less", ".sass"],
            modulesDirectories: ["node_modules"]
        },
        plugins: [
            new webpack.DefinePlugin({
                _PROD_MODE: JSON.stringify(config.mode === "production"),
                _DEV_MODE: JSON.stringify((config.mode === "development")),
                _TEST_MODE: JSON.stringify((config.mode === "test"))
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurenceOrderPlugin(true),
            new webpack.ProvidePlugin({
                _: "lodash",
                $: "jquery",
                jQuery: "jquery"
            }),
            new BowerWebpackPlugin({
                modulesDirectories: ["client/vendor"],
                manifestFiles: ["bower.json", ".bower.json"],
                searchResolveModulesDirectories: false
            }),
            new SaveHashes({ path: "./build/" })
        ]
    };

    switch (config.mode) {
        case "test":
            webpackConfig.entry = {
                app: ["./client/app/app.module.ts"]
            };
            webpackConfig.module.postLoaders.push({
                test: /\.ts$/,
                exclude: /(tests|node_modules|.\client\vendor)\//,
                loader: 'istanbul-instrumenter'
            });
            webpackConfig.devtool = "hidden";
            break;
        case "production":
            webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin("vendors", "vendors.js", Infinity));
            webpackConfig.plugins.push(
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                }), new NgAnnotatePlugin({
                    add: true
                }));
            webpackConfig.debug = false;
            webpackConfig.devtool = "hidden";
            break;
        case "development":
            webpackConfig.debug = true;
            webpackConfig.devtool = "source-map";
            webpackConfig.plugins.push(
				new webpack.optimize.CommonsChunkPlugin("vendors", "vendors.js", Infinity),
				new webpack.HotModuleReplacementPlugin());
            break;
    }
    return webpackConfig;
};