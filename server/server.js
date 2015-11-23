/// <reference path="../typings/tsd.d.ts" />
"use strict";
let env = process.env.NODE_ENV || "development";
var async = require("async"),
    express = require("express"),
    chalk = require("chalk"),
    config = require("./config/config"),
    mongooseConfig = require("./config/mongoose"),
    expressConf = require("./config/express"),
    nconf = require("nconf"),
    routesConf = require("./routes/routes");
    

//import passportConfig from "./config/passport";




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
    expressConf(app);
    routesConf(app);
    app.listen(nconf.get("httpPort"));
    console.log(chalk.green("Server started on port: " + nconf.get("httpPort") + "(" + ")"));
  }
});
 
  
 
  //passportConfig();
  
