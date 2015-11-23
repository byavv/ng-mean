"use strict";

var path = require("path"),
    fs = require("fs"),
    nconf = require("nconf"),
    chalk = require("chalk"),
    defaultConf = require("./defaults");

/**
 * Create app configuration, depending on environment
 */
module.exports = {
    configure: function () {
        nconf.argv().env();
        nconf.use('memory');
        nconf.defaults(defaultConf);
        return this;
    },

    for: function (env, done) {
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
                            ' mode was built'
                            ));
                        done(null);
                    }
                });
            });
        } catch (error) {
            done(error);
        }
    }
}