var mongoose = require("mongoose"),
    nodemailer = require("nodemailer"),
    _ = require("lodash"),
    crypto = require("crypto"),
    User = mongoose.model("User"),
    async = require("async"),
    mailHelper = require("../libs/mail.helper"),
    nconf = require("nconf");
    

//di for testing
module.exports = {
    /** 
     * Route callback for GET /api/reset/:token
     * When user clicks on link in email to reset password.
     */
    validateResetToken: function (req, res) {
        User.findOne({
            "resetData.token": req.params.token,
            "resetData.expires": {
                $gt: Date.now()
            }
        }, (err, user) => {
            if (err) {
                return res.status(500).send();
            };
            if (user) {
                return res.redirect(`/password/reset/${req.params.token}`);
            } else {
                return res.redirect('/password/error');
            }
        });
    },
    /**
     * Route callback for POST "/api/account"
     * returns user account data
     */
    postAccount: function (req, res) {
        User.findOne({
            _id: req.user.id
        }, (err, user) => {
            if (err) return res.status(500).send();
            if (!user) {
                return res.status(400).send();
            } else {
                var account = {};
                user.authProvider !== 'local' && !!user.extOAuth
                    ? Object.assign(account, {
                        provider: user.authProvider,
                        profileUrl: user.extOAuth.providerData.profileUrl
                    })
                    : Object.assign(account, {
                        username: user.username,
                        email: user.email,
                        provider: user.authProvider
                    });
                return res.status(200).json(account);
            }
        });
    },
    /**
     * Update user account data
     * route callback for POST "/api/updateaccount""
     */
    updateAccount: function (req, res) {
        var userId = req.user.id;
        if (userId && req.body.account) {
            User.findOne({ _id: userId }, (err, user) => {
                if (err) res.status(500).send();
                if (!user) {
                    res.status(400).send({ key: "error_user_found" });
                }
                var oldPsw = req.body.account.oldpassword;
                if (user.authenticate(oldPsw)) {
                    if (!!req.body.account.password) {
                        user.password = req.body.account.password;
                    } else {
                        user.password = oldPsw;
                    }
                    user.email = req.body.account.email;
                    user.username = req.body.account.username;
                    user.save((err) => {
                        if (err) {
                            var errList = [];
                            if (err.name === "ValidationError" && err.errors) {
                                errList = _.values(err.errors).map((error) => {
                                    return error.message;
                                });
                                return res.status(400).send({
                                    key: "error_validation",
                                    message: errList
                                });
                            } else {
                                return res.status(500).send({ key: "error_500" });
                            }
                        } else {
                            return res.status(200).send({ key: "info_password_changed_success" });
                        }
                    })
                } else {
                    return res.status(400).send({ key: "error_old_password_is_not_valid" });
                }
            });
        } else {
            return res.status(400).send();
        }
    },
    /**
     * Get user profile data
     * route callback for POST "/profile/:id""
     */
    postProfile: function (req, res) {
        User.findOne({
            _id: req.user.id
        }, (err, user) => {
            if (err) return res.status(500).send()
            if (!user) {
                return res.status(400).send();
            } else {
                return res.status(200).json(user.profile);
            }
        });
    },
    /**
	 * Change user profile data
	 */
    updateProfile: function (req, res, next) {
        var userId = req.user.id;
        if (userId && req.body.profile) {
            User.update({ _id: userId }, { $set: { profile: req.body.profile } }, {}, (err, user) => {
                if (err) return res.status(500).send({ key: "error_500" });
                if (!user) return res.status(400).send({ key: 'error_user_found' });
                return res.status(200)
                    .json({ key: "info_profile_updated_success", profile: req.body.profile });
            })
        } else {
            return res.status(400).send();
        }
    },
    /**
     * Send email with instructions to reset password     * 
     */
    forgot: function (req, res, next) {
        async.waterfall([
            // generate random reset token
            (done) => {
                crypto.randomBytes(20, (err, buffer) => {
                    var token = buffer.toString('hex');
                    done(err, token);
                });
            },
            // save reset token in user profile
            (token, done) => {
                if (req.body.email) {
                    User.findOne({
                        email: req.body.email
                    }, (err, user) => {
                        if (!user) {
                            return res.status(400).send({ key: 'error_user_found' });
                        }
                        user.resetData = {
                            token: token,
                            expires: Date.now() + 3600000
                        };
                        user.save((err) => {
                            done(err, token, user);
                        });
                    })
                } else {
                    return res.status(400).send({ key: "error_email_field_empty" });
                }
            },
            // render email
            (token, user, done) => {
                res.render('templates/reset-password-email', {
                    name: user.username,
                    appName: nconf.get("appName"),
                    url: `http://${req.headers.host}/api/reset/${token}`
                }, (err, emailContent) => {
                    done(err, emailContent, user);
                });
            },
            // send it
            (emailContent, user, done) => {
                mailHelper.sendResetMail(
                    user.email,                 // to
                    nconf.get("mailer").from,   // from
                    emailContent,               // what
                    nconf.get("mailer").options,// options
                    (err) => {
                        if (!err)
                            return res.status(200).send({ key: "info_password_change_mail_sent" });
                        done(err);
                    })
            }
        ], (err) => {
            console.log(err);
            if (err) return next(err);
        });
    }, 
    /**
	 * Change user password using reset password form
	 */
    resetForgotPassword: function (req, res) {
        //var { newPassword, token } = req.body; 
        var newPassword = req.body.password;
        var token = req.body.token;
        if (newPassword && token) {
            User.findOne({ "resetData.token": token }, (err, user) => {
                if (!err && user) {
                    user.password = newPassword;
                    user.resetData = undefined;
                    user.save(function (err) {
                        if (err) {
                            return res.status(500).send({ key: "error_500" });
                        } else {
                            return res.status(200).send({ key: "info_password_changed_success" });
                        }
                    });
                } else {
                    return res.status(400).send({ key: "error_user_found" });
                }
            });
        } else {
            return res.status(400).send({ key: "error_notValidCredentials" });
        }
    }
}
