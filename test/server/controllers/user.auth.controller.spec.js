var request = require('supertest'),
	express = require('express'),
	sinon = require("sinon"),
	rewire = require("rewire"),
	chai = require("chai"),	
	expressConf = require("../../../server/config/express"),	
	assert = chai.assert,
	expect = chai.expect;

describe("User authentication controller unit tests", () => {
	var app;
	var User;
	var JwtUtilStub, createStub, revokeStub;
	var findOneStub, saveStub;	
	var controller;
	var user_to_find;
	before((done) => {				
		//user finded in db mock
		user_to_find = {
			_id: "123456789",
			authenticate: sinon.stub().returns(true)
		}
		findOneStub = sinon.stub().yields(null, user_to_find);
		saveStub = sinon.stub().yields(null, { _id: "0254879456" });
				
		//mongoose User model mock
		User = function () {
			this.save = saveStub;
		};
		User.findOne = findOneStub;		
				
		//jwt util mock
		createStub = sinon.stub().yields(null, { token: "0254879456" });
		revokeStub = sinon.stub().yields(null)
		JwtUtilStub = {
			create : createStub,
			revoke : revokeStub
		}

		controller = rewire("../../../server/controllers/user.auth.controller");
		controller.__set__("User", User);
		controller.__set__("tokenHelper", JwtUtilStub);
		done();
	})
	before(() => {
		app = express();
		expressConf(app);
		app.use("/me", (req, res, next) => {
			req.user = { roles: ["user"] }
			next();
		});
		//fake routes
		app.post('/signup', controller.signup);
		app.post('/signout', controller.signout);
		app.post('/signin', controller.signin);
		app.post('/me', controller.me);
	});
	describe("Sign in user", () => {
		afterEach(()=>{
			findOneStub.reset();
		})
		it("Should sign in without problems", (done) => {
			var user_to_signin = { username: 'marcus', password: '123456789' };
			request(app)
				.post('/signin')
				.send(user_to_signin)
				.expect(200)
				.end((err, res) => {
					expect(res.status).to.be.equal(200);
					expect(findOneStub).to.have.been.calledOnes;					
					expect(createStub.called).to.be.equal(true);	
					expect(res.body).to.have.property('token');
					expect(res.body.token).to.be.equal("0254879456");
					done();
				});
		})
		it("Should fail to sign in without password", (done) => {
			var user_to_signin = { username: 'marcus' };
			request(app)
				.post('/signin')
				.send(user_to_signin)
				.expect(500)
				.end((err, res) => {
					expect(res.status).to.be.equal(500);
					expect(res.body).to.have.property('key');
					expect(res.body.key).to.be.equal("error_500");
					done();
				});
		})
		it("Should fail to sign in if MongoDB returns error", (done) => {
			findOneStub.yields(new Error("mongoerror"), null);
			var user_to_signin = { username: 'marcus', password: "12345678" };

			request(app)
				.post('/signin')
				.send(user_to_signin)
				.expect(500)
				.end((err, res) => {
					expect(res.status).to.be.equal(500);
					expect(res.body).to.have.property('key');
					expect(res.body.key).to.be.equal("error_500");
					expect(res.body.message).to.be.equal("mongoerror");
					done();
				});
		})
		it("Should fail to sign in if error creating a token occurs", (done) => {
			findOneStub.yields(null, user_to_find);
			createStub.yields(new Error("tokenerror"), null);

			var user_to_signin = { username: 'marcus', password: "12345678" };
			request(app)
				.post('/signin')
				.send(user_to_signin)
				.expect(500)
				.end((err, res) => {
					expect(res.status).to.be.equal(500);
					expect(res.body).to.have.property('key');
					expect(res.body.key).to.be.equal("error_500");
					expect(res.body.message).to.be.equal("tokenerror");
					done();
				});
		})
		it("Should fail to sign in if authentication does not pass", (done) => {
			user_to_find = {
				authenticate: () => {
					return false;
				}
			}
			findOneStub.yields(null, user_to_find);
			createStub.yields(null, null);

			var user_to_signin = { username: 'marcus', password: "12345678" };
			request(app)
				.post('/signin')
				.send(user_to_signin)
				.expect(401)
				.end((err, res) => {
					expect(res.status).to.be.equal(401);
					done();
				});
		})
	})
	describe("Sign up user", () => {
		it("Should sign up without problems", (done) => {
			var user_to_signin = { username: 'marcus', password: '123456789', email: "john@doe.com" };
			createStub.yields(null, { token: "0254879456" });
			request(app)
				.post('/signup')
				.send(user_to_signin)
				.expect(200)
				.end((err, res) => {
					expect(res.status).to.be.equal(200);
					expect(createStub.called).to.be.equal(true);
					expect(res.body).to.have.property('token');
					expect(res.body.token).to.be.equal("0254879456");
					done();
				});
		})


		it("Should get errors from list", (done) => {
			var user_to_signin = { username: 'marcus', password: '123456789', email: "john@doe.com" };
			saveStub.yields({ name: "ValidationError", errors: [{ message: "error1" }, { message: "error2" }] }, null);

			request(app)
				.post('/signup')
				.send(user_to_signin)
				.expect(400)
				.end((err, res) => {
					expect(res.status).to.be.equal(400);
					expect(res.body).to.to.have.property("key");
					expect(res.body.message).to.to.have.length(2);					
					expect(createStub.called).to.be.equal(true);	
					done();
				});
		});
	});
	describe("Sign out user", () => {
		it("Should get errors from list", (done) => {
			request(app)
				.post('/signout')
				.expect(200)
				.end((err, res) => {
					expect(res.status).to.be.equal(200);
					expect(res.text).to.be.equal("OK");
					expect(revokeStub.called).to.be.equal(true);	
					done();
				});
		});
	})
	describe("Check user auth ", () => {
		it("Should check authorization success", (done) => {
			request(app)
				.post('/me')
				.send({ roles: ["user"] })
				.expect(200)
				.end((err, res) => {
					expect(res.status).to.be.equal(200);
					expect(res.text).to.be.equal("OK");
					expect(revokeStub.called).to.be.equal(true);					
					done();
				});
		});
		it("Should check authorization fail (check if user admin)", (done) => {
			request(app)
				.post('/me')
				.send({ roles: ["user", "admin"] })//if user has these roles, should pass, but it don't
				.expect(401)
				.end((err, res) => {
					expect(res.status).to.be.equal(401);
					done();
				});
		});
	});
	after((done) => {
		done();
	})
})

/*describe("User auth controller integration testing", () => {
	before((done) => {
		//configure mongoose and jwt in here
		done();
	})
	it("should do smth", () => {

	})
})*/
