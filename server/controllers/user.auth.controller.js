var mongoose = require("mongoose");

var tokenHelper,
    User;
//di for testing
module.exports = function (user, jwt) {
    if (!user) {
        User = mongoose.model("User");
    } else {
        User = user;
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
            res.send(200, { name: 'test' });
        },
        /**
         * User registration
         * middleware for POST route: /auth/signin
         */
        signin: function (req, res, next) {
            var username = req.body.username;
            var password = req.body.password;
            if (!!username && !!password) {                
              User.findOne({ username: username }, (err, user) => {
                    if (err) return res.status(500).send({ key: "error_500", message: err.message });
                    if (!!user && user.authenticate(password)) {
                        user.password = undefined;
                        user.salt = undefined;
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
            }else{
                return res.status(500).send({ key: "error_500" });
            }
        },
        /**
         * User registration
         * middleware for POST route: /auth/signout
         */
        signout: function (req, res, next) {

        }
    }
}