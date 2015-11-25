var config = require("../../server/config/config");
var mongooseConf = require("../../server/config/mongoose");
var mongoose = require("mongoose");
var User;

/**
 * Global before, after blocks
 */
before((done) => {
	config.configure.for("test", (err) => {
		if (err) {
			console.error("Error config: " + err);
			done(err);
		} else {
			done();
		}
	});
});
before((done) => {
	mongooseConf.configure((err) => {
		if (err) {
			console.error("Error mongoose config: " + err);
			done(err);
		}
 		User = mongoose.model("User");
		done();
	})
});
before((done) => {
	process.nextTick(done);
});
after((done) => {
	User.remove({}, () => {
		console.log("Test database cleaned");
		mongooseConf.close((err) => {
			if (err) {
				console.log(err);
			}
			done();
		})
	});
})