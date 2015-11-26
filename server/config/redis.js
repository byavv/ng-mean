"use strict"
var redis = require("redis"),
	nconf = require("nconf");

module.exports = redis.createClient(nconf.get("redis"))
	.on('error', (err) => {
		throw err;
	})
	.on('connect', () => {
		console.info("Connected to redis");
	});
