var mongoose = require("mongoose"),
    passport = require("passport"),
    _ = require("lodash"),
    tokenHelper = require("../libs/jwt.util"),
    User = mongoose.model("User");

module.exports = {
    /**
     * User registration
     * middleware for POST route: /auth/signup
     */
    signup: function (req, res) {
        var user = new User(req.body);
        user.authProvider = "local";
        try {
            user.save((err) => {
                if (err) {
                    var validationErrList = [];
                    if (err.name === "ValidationError" && err.errors) {
                        validationErrList = _.values(err.errors)
                            .map((validationError) => {
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
        //var {username, password} = req.body
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
            return res.status(400).send({ key: 'error_notValidCredentials' });
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
                    //return res.redirect('/signin');
                    return res.render("serverError", {
                        title: "",
                        error: err
                    });
                }
                tokenHelper.create(user, (err, result) => {
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
