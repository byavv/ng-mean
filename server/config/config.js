"use strict";

var path = require("path"),
    fs = require("fs"),
    nconf = require("nconf"),
    chalk = require("chalk"),
    defaultConf = require("./defaults");
    

/**
 * Add environment specific configuration
 */
let config = {
    for: (env, done) => {
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
};
/**
 * Default app configuration
 * Use: config.configure.for("Development",(err)=>{..})
 */
Object.defineProperty(config, "configure", {
    get: () => {
        nconf.argv().env();
        nconf.use('memory');
        nconf.defaults(defaultConf);
        return config;
    }
});
module.exports = config;