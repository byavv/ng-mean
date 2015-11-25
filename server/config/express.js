"use strict";

var express = require("express"),
    morgan = require( "morgan"),
    bodyParser = require( "body-parser"),
    passport = require( "passport"),
    cookieParser = require( "cookie-parser"),
    session = require( "express-session"),
    methodOverride = require( "method-override"),
    path = require( "path"),
    wpConfig = require("./webpack");

module.exports =  function (app) {
    var rootPath = process.cwd();
    app.set('views', rootPath + '/server/views');
    app.set('view engine', 'jade');
    if (process.env.NODE_ENV === "development") {
        var webpackDevMiddleware = require("webpack-dev-middleware");
        var webpack = require('webpack');
        var webpackConfig = wpConfig();
        var compiler = webpack(webpackConfig);
        app.use(webpackDevMiddleware(compiler, {
            publicPath: '/build/client',
            stats: { colors: true }
        }));
    }
    if (process.env.NODE_ENV !== "test") {
        app.use(morgan("dev"));
    }
   
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride("_method"));
    app.use(passport.initialize());
    app.use('/build/client', express.static(rootPath + '/build/client'));

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

