/// <reference path="../typings/tsd.d.ts" />
"use strict";

var async = require("async"),
  express = require("express"),
  chalk = require("chalk"),
  config = require("./config/config"),
  mongooseConfig = require("./config/mongoose"),
  nconf = require("nconf");

let env = process.env.NODE_ENV || "development";

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
    try {
      let client = require("./config/redis");
      if (env != "production") {
        client.flushall((err) => {
          if (err) {
            throw err;
          }
          console.info(chalk.green("Redis cleaned "));
        });
      }
      require("./config/passport")();
      require("./config/express")(app);
      require("./routes/routes")(app);

      app.listen(nconf.get("httpPort"));
      console.info(chalk.green("Server started on http port: " + nconf.get("httpPort")));
    } catch (error) {
      console.error(chalk.bgRed.white("App start error " + error));
    }
  }
});

