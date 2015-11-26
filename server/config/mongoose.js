"use strict";

var mongoose = require("mongoose"),
	path = require("path"),
	fs = require("fs"),
	chalk = require("chalk"),
	nconf = require("nconf");

/**
 * Configure mongoose
 */
exports.configure = function (done) {
	mongoose.connect(nconf.get("db"));
	let db = mongoose.connection;
	db.on('error', (err) => {
		console.log(chalk.red("connection error " + err));
	});
	db.once('open', () => {
		console.log(chalk.green("Database opened"));
	});

	let modelsPath = path.join(__dirname, '../models');
	try {
		fs.readdir(modelsPath, (err, modelsFiles) => {
			if (err) return done(err);
			else {
				console.info("Models loaded: ");
				!!modelsFiles && modelsFiles.forEach((file) => {
					if (/(.*)\.(js$)/.test(file)) {
						var model = require(path.join(modelsPath, file));
						console.info("	" + chalk.grey(model.modelName));
					}
				});
				done(null);
			}
		});
	} catch (error) {
		done(error);
	}
};

exports.close = function (done) {
	mongoose.disconnect((err) => {
		console.info(chalk.yellow('Disconnected from MongoDB.'));
		done(err);
	});
}