'use strict';

var tokenHelper = require('../middleware/jwtTokenHelper'),
	jwt = tokenHelper.jwt,	
	nconf = require("nconf"),
	passport = require('passport'),
	auth = require('../controllers/user.auth.controller')(),
	api = require('../controllers/user.api.controller')();

module.exports = function(app) {
	app.route('/api/profile').post(jwt({
		secret: nconf.get("jwtAuth.secret"),
		refresh: true
	}),  api.profile);

	// Update user profile
	app.route('/api/profile').put(jwt({
		secret: nconf.get("jwtAuth.secret"),
		refresh: true
	}), api.updateProfile);

	app.route("/api/account").post(jwt({
		secret: nconf.get("jwtAuth.secret"),
		refresh: true
	}),api.getAccount);

	app.route('/api/updateaccount').post(jwt({
		secret: nconf.get("jwtAuth.secret"),
		refresh: true
	}),api.updateAccount);
	app.route('/api/forgot').post(api.forgot);
	app.route('/api/resetpassword/').post(api.resetForgotPassword);
	app.route('/api/reset/:token').get(api.validateResetToken);

	app.param('token', api.userByToken);

	// Local authentication routes
	app.route('/auth/signup').post(auth.signup);
	app.route('/auth/signin').post(auth.signin);
	app.route('/auth/signout').post(jwt({
		secret: nconf.get("jwtAuth.secret"),
		refresh: true
	}), auth.signout);
	app.route('/auth/me').post(jwt({
		secret: nconf.get("jwtAuth.secret"),
		refresh: true
	}), auth.me);

	/**
	 * in case of using express-jwt
	 * app.route('/auth/me').post(jwt({
		secret: config.jwtAuth.secret,
		isRevoked: tokenHelper.isRevoked
	}), users.me);
	 * */

	//Github authentication routes
	app.route('/auth/github').get(passport.authenticate('github', {
		scope: [ 'user:email' ]
	}));
	app.route('/auth/github/callback').get(auth.oauthCallback('github'));
};