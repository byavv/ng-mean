/// <reference path="../typings/tsd.d.ts" />
"use strict";
let env = process.env.NODE_ENV || "development";
var async = require("async"),
  express = require("express"),
  chalk = require("chalk"),
  config = require("./config/config"),
  mongooseConfig = require("./config/mongoose"),
  nconf = require("nconf");

async.waterfall([
  (done) => {
    config.configure.for(env, (err) => {
      return done(err);
    });
  },
  (done) => {
    mongooseConfig.configure((err) => {
      return done(err);
    });
  }
], (err, res) => {
  if (err) console.log(err);
  else {
    let app = express();
    require("./config/passport")();
    require("./config/express")(app);
    require("./routes/routes")(app);

    app.listen(nconf.get("httpPort"));
    console.log(chalk.green("Server started on http port: " + nconf.get("httpPort")));
  }
});

