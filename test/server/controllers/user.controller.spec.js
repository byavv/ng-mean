var request = require('supertest'),
	express = require('express'),
	sinon = require("sinon"),
	chai = require("chai"),
	//mongooseConf = require("../../../server/config/mongoose"),
	config = require("../../../server/config/config"),

	expressConf = require("../../../server/config/express"),
	//mongoose = require("mongoose"),
	assert = chai.assert,
	expect = chai.expect;


chai.should();

describe("User authentication controller unit tests", () => {
	var app;
	var User;
	var JwtTokenHelper;
	var stubUser;
	var stubJwtHelper;
	var controller;
	var user_to_find;
	before((done) => {
		console.log("I called in unit tests")
		config.configure().for("test", (err) => {
			if (err) {
				console.error("Error config: " + err);
				done(err);
			} else {
				//finded user mock
				user_to_find = {
					authenticate: () => {
						return true;
					}
				}
				//mongoose User mock
				User = function () {
					this.save = function (cb) {
						cb(null, { _id: 123456 });
					}
					this.findOne = function (request, cb) {
						cb(null, { _id: 123456 });
					}
				}
				//jwt middleware mock
				JwtTokenHelper = function () {
					this.create = function (user, cb) {
						cb(null, {
							id: "fakeid",
							username: "fakeusername",
							token: "fakeToken"
						});
					}
				}
				//stub user and tokenHelper				
				stubUser = sinon.stub(new User());
				stubJwtHelper = sinon.stub(new JwtTokenHelper());

				stubUser.findOne.yields(null, user_to_find);
				stubUser.save.yields(null, { _id: "0254879456" });

				stubJwtHelper.create.yields(null, { token: "0254879456" });

				controller = require("../../../server/controllers/user.auth.controller")(stubUser, stubJwtHelper);
				done();
			}
		})
	})
	before(() => {
		app = express();
		expressConf(app);
		//fake routes
		app.post('/signup', controller.signup);
		app.post('/signout', controller.signout);
		app.post('/signin', controller.signin);
	});

	describe("User authentication controller tests", () => {		
		it("Should signin without problems", (done) => {
			var user_to_signin = { username: 'marcus', password: '123456789' };
			request(app)
				.post('/signin')
				.send(user_to_signin)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					expect(res.status).to.be.equal(200);	
					assert(stubUser.findOne.calledOnce);
					assert(stubJwtHelper.create.calledOnce);					
					expect(res.body).to.have.property('token');
					expect(res.body.token).to.be.equal("0254879456");
					done();
				});
		})
		it("Should fail sign in with no password", (done) => {
			var user_to_signin = { username: 'marcus' };
			request(app)
				.post('/signin')
				.send(user_to_signin)
				.expect(500)
				.end((err, res) => {
					if(err) throw err;
					expect(res.status).to.be.equal(500);	
					expect(res.body).to.have.property('key');
					expect(res.body.key).to.be.equal("error_500");
					done();
				});
		})
		it("Should fail sign in if DB returns error", (done) => {			
			stubUser.findOne.yields(new Error("mongoerror"), null);	
			var user_to_signin = { username: 'marcus', password:"12345678" };
			
			request(app)
				.post('/signin')
				.send(user_to_signin)								
				.expect(500)
				.end((err, res) => {
					if(err) throw err;					
					expect(res.status).to.be.equal(500);					
					expect(res.body).to.have.property('key');
					expect(res.body.key).to.be.equal("error_500");
					expect(res.body.message).to.be.equal("mongoerror");
					done();
				});
		})
		it("Should fail sign in if error creating a token", (done) => {
			stubUser.findOne.yields(null, user_to_find);
			stubJwtHelper.create.yields(new Error("tokenerror"), null);		
			
			var user_to_signin = { username: 'marcus', password:"12345678" };
			request(app)
				.post('/signin')
				.send(user_to_signin)							
				.expect(500)
				.end((err, res) => {
					if(err) throw err;
					expect(res.status).to.be.equal(500);					
					expect(res.body).to.have.property('key');
					expect(res.body.key).to.be.equal("error_500");
					expect(res.body.message).to.be.equal("tokenerror");
					done();
				});
		})

		it("Should signout", () => { })
		it("Should signup", (done) => {
			request(app)
				.post('/signup')
				.expect({ name: "test" }, done);
		})

		it("Should call", () => {
			stubUser.save((err, res) => {
				
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
