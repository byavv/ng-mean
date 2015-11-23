var redis = require('redis'),
    jwt = require("jsonwebtoken"),
    uuid = require("node-uuid"),
    nconf = require("nconf");

var client = redis.createClient();
client.on('error', (err) => {
    throw new Error(err)
});

client.on('connect', () => {
    console.log("Connected to redis");
});

module.exports = {
    /**
    *  Create new token from user profile and add it to storage
    */
    create: function (user, done) {
        var tokenId = uuid.v4() + "-" + user._id;
        var token = jwt.sign({
            id: user._id,
            jti: tokenId,
            roles: user.roles
            //add claims you need
        }, nconf.get("jwtAuth.secret"), {
                issuer: "https://my.server.issued.token.url.com",
                subject: user.username,
                audience: "https://my.resource.server.token.for.url.com",
                expiresIn: nconf.get("jwtAuth.expiration_time")
                //todo ignoreExpiration :true
            });
        // data to be send to client
        var clientData = {
            id: user._id,
            username: user.username,            
            token: token
        };
        // set to redis
        client.set(tokenId, token, (err) => {
            if (err) {
                return done(err);
            }
            client.expire(tokenId, nconf.get("jwtAuth.expiration_time"), (err) => {
                if (err) {
                    return done(err);
                }
                return done(null, clientData);
            });
        });
    },
    /**
    * Revoke token deleting it from storage
    */
    revoke: function (payload, done) {
        var tokenId = payload.jti;
        if (tokenId) {
            client.expire(tokenId, 0, (err, reply) => {
                if (err) {
                    return done(err);
                }
                return done(null, reply);
            })
        } else {
            return done(new Error("Invalid token id"))
        }
    },
    /**
    * express-jwt isRevoked check * 
    */
    isRevoked: function (req, payload, next) {
        var tokenId = payload.jti;//this is opaque token id
        if (tokenId) {
            client.get(tokenId, (err, token) => {
                if (err) {
                    return next(err);
                }
                var expired = true;
                if (expired) {
                    req.refreshToken = 1//call create token function
                }
                return next(null, !token);
            });
        } else {
            return next(new Error("Invalid token id"))
        }
    },
    checkRefresh: function (req, res, next) {
        if (!!req.refreshToken) {
            res.set({
                'refreshToken': req.refreshToken
            })
        }
        next(null);
    }
}
