var jwt = require('jsonwebtoken');
var chai = require('chai'),
  nconf = require("nconf"),
  sinon = require("sinon"),
  assert = chai.assert,
  expect = chai.expect;

var config = require("../../../server/config/config");

describe('JWT util tests', () => {
  var jwtHelper,
    setexStub,
    expireStub;
  before((done) => {
    config.configure.for("test", (err) => {
      done();
    })
  })
  before((done) => {
    var redisMock = {};
    setexStub = sinon.stub().yields(null);
    expireStub = sinon.stub().yields(null, "fake_token_replyed_by_redis");
    redisMock.setex = setexStub;
    redisMock.expire = expireStub;
    jwtHelper = require("../../../server/utils/jwt.helper")(redisMock);
    done();
  })
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
      expect(expireStub).to.have.been.calledOnes;
      done();
    });
  })  
});