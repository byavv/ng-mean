var jwt = require('jsonwebtoken');
var chai = require('chai'),
  nconf = require("nconf"),
  sinon = require("sinon"),
  rewire = require("rewire"),
  assert = chai.assert,
  expect = chai.expect;

var config = require("../../../server/config/config");

describe('JWT util tests', () => {
  var jwtHelper,
    setexStub,
    expireStub;
  before((done) => {
    var mockRedisClient = {};
    setexStub = sinon.stub().yields(null);
    expireStub = sinon.stub().yields(null, "fake_token_replyed_by_redis");
    mockRedisClient.setex = setexStub;
    mockRedisClient.expire = expireStub;    

    jwtHelper = rewire("../../../server/libs/jwt.util");
    jwtHelper.__set__("client", mockRedisClient);
    done();
  });
  it('Should create new ', (done) => {
    var user = { _id: "fakeid1", roles: ["user"] }
    jwtHelper.create(user, (err, clientdata) => {
      expect(err).to.be.null;
      expect(clientdata).to.have.property("token");
      expect(clientdata.token).to.be.an("String");
      done();
    });
  });
  it("Should revoke user authentication", (done) => {
    var payload = { id: "fakeid1", roles: ["user"] }
    jwtHelper.revoke(payload, (err, reply) => {
      expect(err).to.be.null;
      expect(reply).to.be.equal("fake_token_replyed_by_redis");
      expect(expireStub.calledOnce).to.have.be.equal(true);
      done();
    });
  })
});