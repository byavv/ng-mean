var webpackConfig = require("./server/config/webpack")("test");
var webpack = require("webpack");

module.exports = function(config) {
    config.set({
        basePath: "",
        frameworks: ["jasmine"],
        files: [
            // needed because of this issue: https://github.com/webpack/style-loader/issues/31
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            { pattern: "spec.bundle.js", watched: false }
        ],
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true,           
            stats: {
                colors: true
            }
        },
        coverageReporter: {
            type : 'lcov',
            dir: 'coverage'            
        },        
        exclude: [],
        captureTimeout: 60000,
        preprocessors: {
            'spec.bundle.js': ["webpack"],
        },
        singleRun: true,
        reporters: ["mocha", "coverage"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ["PhantomJS"],
        plugins: [ 
            require("karma-webpack"),
            "karma-jasmine",
            "karma-chrome-launcher",
            "karma-phantomjs-launcher",
            "karma-mocha-reporter",
            "karma-js-coverage"
        ]
    });
};