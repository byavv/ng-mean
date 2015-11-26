"use strict"
var redis = require("redis"),
	chalk = require("chalk"),
	nconf = require("nconf");

module.exports = redis.createClient(nconf.get("redis"))
	.on('error', (err) => {
		throw err;
	})
	.on('connect', () => {
		console.info(chalk.green("Connected to redis on port: " + nconf.get("redis").port));
	});
