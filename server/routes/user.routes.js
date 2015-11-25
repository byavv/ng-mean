'use strict';

var tokenHelper = require('../utils/jwt.helper')(),
	jwt = require("express-jwt"),
	nconf = require("nconf"),
	passport = require('passport'),
	auth = require('../controllers/user.auth.controller'),
	api = require('../controllers/user.api.controller');

module.exports = function (app) {
	app.route('/api/profile').post(jwt({
		secret: nconf.get("jwtAuth").secret,
		isRevoked: tokenHelper.isRevoked
	}),  api.postProfile);

	// Update user profile
	app.route('/api/profile').put(jwt({
		secret: nconf.get("jwtAuth").secret,
		isRevoked: tokenHelper.isRevoked
	}), api.updateProfile);

	app.route("/api/account").post(jwt({
		secret: nconf.get("jwtAuth").secret,
		isRevoked: tokenHelper.isRevoked
	}),api.postAccount);

	app.route('/api/updateaccount').post(jwt({
		secret: nconf.get("jwtAuth").secret,
		isRevoked: tokenHelper.isRevoked
	}),api.updateAccount);
	
	app.route('/api/forgot').post(api.forgot);
	app.route('/api/resetpassword/').post(api.resetForgotPassword);
	app.route('/api/reset/:token').get(api.validateResetToken);

	

	// Local authentication routes
	app.route('/auth/signup').post(auth.signup);
	app.route('/auth/signin').post(auth.signin);
	app.route('/auth/signout').post(jwt({
		secret: nconf.get("jwtAuth").secret,
		isRevoked: tokenHelper.isRevoked
	}), auth.signout);
	app.route('/auth/me').post(jwt({
		secret: nconf.get("jwtAuth").secret,
		isRevoked: tokenHelper.isRevoked
	}), auth.me);

	

	//Github authentication routes
	app.route('/auth/github').get(passport.authenticate('github', {
		scope: ['user:email']
	}));
	app.route('/auth/github/callback').get(auth.oauthCallback('github'));
};