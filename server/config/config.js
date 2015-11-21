"use strict";

var path = require("path"),
    fs = require ("fs"),
    nconf = require ("nconf"),
    chalk = require ("chalk"),
    defaultConf = require ("./defaults");

/**
 * Create app configuration, which depends on environment
 */
exports.configure = function(env, done) {
    nconf.argv().env();
    nconf.use('memory');
    nconf.defaults(defaultConf);
    let configPath = path.join(__dirname, './env');
    try {
        fs.readdir(configPath, (err, files) => {
            if (err) return done(err);
            !!files && files.forEach((file) => {
                if (file.match(new RegExp(env))) {
                    nconf.overrides(require(configPath + '/' + file).config);                   
                    console.log(chalk.green(
                        'Configuration for ' +
                        chalk.white.bgBlue(env.toUpperCase()) +
                        ' mode was build'
                    ));
                    done(null);
                }
            });
        });
    } catch (error) {
        done(error);
    }
};
