"use strict";

var express = require("express"),
    morgan = require( "morgan"),
    bodyParser = require( "body-parser"),
    passport = require( "passport"),
    cookieParser = require( "cookie-parser"),
    session = require( "express-session"),
    methodOverride = require( "method-override"),
    path = require( "path");
//import wpConfig from "./webpack.conf";

exports.configure =  function (app) {
    let rootPath = process.cwd();
    app.set('views', rootPath + '/server/views');
    app.set('view engine', 'jade');
    if (process.env.NODE_ENV === "development") {
        let webpackDevMiddleware = require("webpack-dev-middleware");
        let webpack = require('webpack');
       /* let webpackConfig = wpConfig();
        let compiler = webpack(webpackConfig);
        app.use(webpackDevMiddleware(compiler, {
            publicPath: '/build/client',
            stats: { colors: true }
        }));*/
    }
    app.use(morgan("dev"));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride("_method"));
    app.use(passport.initialize());
    app.use('/build/client', express.static(rootPath + '/build/client'));

    // error handler for all the applications 
    app.use((err, req, res, next) => {
        let code = 500,
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