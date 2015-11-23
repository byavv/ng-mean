var redis = require('redis'),
    jwt = require("jsonwebtoken"),
    nconf = require("nconf");

var client;

module.exports = function (redisMock) {
    if (redisMock) {
        client = redisMock;
    } else {
        client = redis.createClient();
        client.on('error', (err) => {
            throw new Error(err)
        });
        client.on('connect', () => {
            console.log("Connected to redis");
        });
    }
    return {
        /**
        *  Create new token from user profile and add it to storage
        */
        create: function (user, done) {
            var token = jwt.sign({
                id: user._id,
                roles: user.roles
                //add claims you need
            }, nconf.get("jwtAuth").secret, {
                    issuer: "https://my.server.issued.token.url.com",
                    subject: user.username,
                    audience: "https://my.resource.server.token.for.url.com",
                    expiresIn: nconf.get("jwtAuth").access_expiration_time
                });
            // data to be send to client
            var clientData = {
                id: user._id,
                username: user.username,
                token: token
            };
            // set to redis
            client.setex([user._id, nconf.get("jwtAuth").access_expiration_time, token], (err) => {
                return done(err, clientData);
            });
        },
        /**
        * Revoke token deleting it from storage
        */
        revoke: function (payload, done) {
            client.expire(payload.id, 0, (err, reply) => {
                if (err) {
                    return done(err);
                }
                return done(null, reply);
            });
        },
        /**
        * express-jwt isRevoked check * 
        */
        isRevoked: function (req, payload, next) {
            client.get(payload.id, (err, token) => {
                if (err) {
                    return next(err);
                }
                return next(null, !token);
            });
        }
    }
}
