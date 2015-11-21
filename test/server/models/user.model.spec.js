/// <reference path="../../../typings/tsd.d.ts" />

var chai = require("chai");
var mongooseConf = require("../../../server/config/mongoose");
var config = require("../../../server/config/config");
var mongoose = require("mongoose");

chai.should();
var assert = chai.assert;

describe("User model methods & validation tests", () => {
	var User;
	var user;
	before((done) => {
		config.configure("test", (err) => {
			if (err) {
				console.error("Error config: " + err);
				done(err);
			} else {
				mongooseConf.configure((err) => {
					if (err) {
						console.error("Error mongoose config: " + err);
						done(err);
					}
					try {
						User = mongoose.model("User");
						done();
					} catch (error) {
						console.error("Error mongoose config: " + error);
						done(error);
					}
				})
			}
		})
	})
	before((done) => {
		user = new User();
		done();
	})

	describe("Should have default properties", () => {
		it("Should have defaults", () => {
			assert(user);
		});
		it('should begin with no users', (done) => {
			User.find({}, (err, users) => {
				users.should.have.length(0);
				done();
			});
		});
		it("Saved without problems", (done) => {
			user.save((err, res) => {
				console.log(res);
				chai.assert(res);
				done();
			})
		});
	});

	after((done) => {
		User.remove({}, () => {
			mongooseConf.close((err) => {
				if (err) {
					console.log(err);
				}
				done();
			})
		});
	})
});