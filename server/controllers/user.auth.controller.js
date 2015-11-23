var mongoose = require("mongoose"),
    passport = require("passport"),
    _ = require("lodash");

var tokenHelper,
    User;
//di for testing
module.exports = function (mockuser, jwt) {
    if (!mockuser) {
        User = mongoose.model("User");
    } else {
        User = mockuser;
    }
    if (!jwt) {
        tokenHelper = require("../middleware/jwtTokenHelper");
    } else {
        tokenHelper = jwt;
    }

    return {
        /**
         * User registration
         * middleware for POST route: /auth/signup
         */
        signup: function (req, res, next) {
            var user = new User(req.body);
            user.provider = "local";
            try {
                user.save((err) => {
                    if (err) {
                        var validationErrList = [];
                        if (err.name === "ValidationError" && err.errors) {
                            validationErrList = _.values(err.errors).map((validationError) => {
                                return validationError.message;
                            });
                            return res.status(400).send({
                                key: "error_validation",
                                message: validationErrList
                            });
                        } else {
                            return res.status(500).send({ key: "error_500", message: err.message });
                        }
                    } else {
                        tokenHelper.create(user, (err, result) => {
                            if (err) {
                                return res.status(500).send({ key: "error_500", message: err.message });
                            }
                            return res.status(200).json(result);
                        });
                    }
                });
            } catch (error) {
                return res.status(500).send({ key: "error_500" });
            }

        },
        /**
         * User login api
         * middleware for POST route: /auth/signin
         */
        signin: function (req, res, next) {
            var username = req.body.username;
            var password = req.body.password;
            if (!!username && !!password) {
                User.findOne({ username: username }, (err, user) => {
                    if (err) return res.status(500).send({ key: "error_500", message: err.message });
                    if (!!user && user.authenticate(password)) {
                        tokenHelper.create(user, (err, result) => {
                            if (err) {
                                return res.status(500).send({ key: "error_500", message: err.message });
                            }
                            return res.status(200).json(result);
                        });
                    } else {
                        return res.status(401).send({ key: 'error_notValidCredentials' });
                    }
                })
            } else {
                return res.status(500).send({ key: "error_500" });
            }
        },
        /**
         * User log out api
         * middleware for POST route: /auth/signout
         */
        signout: function (req, res, next) {
            tokenHelper.revoke(req.user, (err, result) => {
                if (err) {
                    return res.status(500).send({ key: "error_500" });
                }
                return res.status(200).send("OK");
            });
        },
        /**
         * Check if user authorized for roles
         * middleware for POST route: /auth/me
         */
        me: function (req, res) {
            var roles = req.body.roles || '';
            if (_.intersection(req.user.roles, roles).length === roles.length) {
                return res.status(200).send("OK");
            } else {
                return res.status(401).send("NOT OK");
            }
        },

        /**
         * Passport auth callback
         */
        oauthCallback: function (strategy) {
            return function (req, res, next) {
                passport.authenticate(strategy, (err, user, redirectURL) => {
                    if (err || !user) {
                        return res.redirect('/signin');
                    }
                    tokenHelper.create(user, function (err, result) {
                        if (err) {
                            return res.redirect(redirectURL || '/');
                        }
                        return res.render("authSuccess", {
                            user: result
                        });
                    });
                })(req, res, next);
            };
        }
    }
}