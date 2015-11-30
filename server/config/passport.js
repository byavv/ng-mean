'use strict';

var mongoose = require('mongoose'),
	passport = require("passport"),
	nconf = require("nconf"),
	GitHubStrategy = require('passport-github2').Strategy,
	User = mongoose.model("User");

module.exports = function () {
	passport.use(
		new GitHubStrategy({
			clientID: nconf.get("github").clientID,
			clientSecret: nconf.get("github").clientSecret,
			callbackURL: nconf.get("github").callbackURL
		}, (accessToken, refreshToken, profile, done) => {
			process.nextTick(() => {
				// find the user in the database based on github id
				User.findOne({ authProvider: "github", 'extOAuth.providerData.id': profile.id }, (err, user) => {
					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err)
						return done(err); 

					// if the user is found, then log them in
					if (user) {
						return done(null, user); // user found, return that user
						//todo: updata data in it
						// what data to update?
						// username? e-mails
					} else {
						// if there is no user found with that github id, create them
						var newUser = new User();
						newUser.authProvider = "github";
						newUser.username = `github_${profile.username}`;
						newUser.email = `github_${profile.emails[0].value}`;
						newUser.imageUrl = profile._json.avatar_url;
						newUser.extOAuth = {};
						newUser.extOAuth.providerData = {
							id: profile.id, // set the account github id
							token: accessToken, // we will save the token that github provides to the user
							name: profile.username,// look at the passport user profile to see how names are returned
							email: profile.emails[0].value// github can return multiple emails so we'll take the first
						};
						// save our user to the database
						newUser.save((err) => {
							if (err) {
								return done(err)
							} else {
								return done(null, newUser);
							}
							//throw err;
							// if successful, return the new user
							
						});
					}
				});
			});
		}));


	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser((id, done) => {
		User.findOne({
			_id: id
		}, '-salt -password', (err, user) => {
			done(err, user);
		});
	});

};
 