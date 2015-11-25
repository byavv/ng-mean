"use strict";

var express = require("express"),
    morgan = require( "morgan"),
    bodyParser = require( "body-parser"),
    passport = require( "passport"),
    cookieParser = require( "cookie-parser"),
    session = require( "express-session"),
    methodOverride = require( "method-override"),
    path = require( "path"),
    wpConfig = require("./webpack"),
    webpackAssets = require('express-webpack-assets');

module.exports =  function (app) {
    var rootPath = process.cwd();
    app.set('views', rootPath + '/server/views');
    app.set('view engine', 'jade');
    if (process.env.NODE_ENV === "development") {
        app.use(webpackAssets('./build/webpack-assets.json', { devMode: true }));
        var webpackDevMiddleware = require("webpack-dev-middleware");
        var webpack = require('webpack');
        var webpackConfig = wpConfig("development");
        var compiler = webpack(webpackConfig);
        app.use(webpackDevMiddleware(compiler, {
            publicPath: '/build/',
            stats: { colors: true }
        }));
    }else {
		app.use(webpackAssets('./build/webpack-assets.json', { devMode: false }));
	}
    if (process.env.NODE_ENV !== "test") {
        app.use(morgan("dev"));
    }
  
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride("_method"));
    app.use(passport.initialize());
    app.use('/build/', express.static(rootPath + '/build/'));

    // error handler for all the applications 
    app.use((err, req, res, next) => {
        var code = 500,
            msg = { message: "Internal Server Error" };
        switch (err.name) {
            case "UnauthorizedError":
                code = err.status;
                msg = undefined;
                break;
            case "BadRequestError":
            case "UnauthorizedAccessError":
            case "NotFoundError":
                code = err.status;
                msg = err.inner;
                break;
            default:
                break;
        }
        return res.status(code).json(msg);
    });
};

