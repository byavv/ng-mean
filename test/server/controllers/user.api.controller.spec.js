var request = require('supertest'),
	express = require('express'),
	sinon = require("sinon"),
	chai = require("chai"),
	rewire = require("rewire"),
	expressConf = require("../../../server/config/express"),
	assert = chai.assert,
	expect = chai.expect;

chai.should();
describe("User api controller tests", () => {
	var app;
	var mockUser, mockMailHelper;
	var findOneStub, saveStub, sendResetMailstub, authenticateStub;
	var controller;
	var user_to_find;
	before((done) => {				
		//user to be returnen as finded in db mock
		authenticateStub = sinon.stub().returns(true);
		user_to_find = {
			_id: "123456789",
			username: "John",
			profile: "github",
			authenticate: authenticateStub,
			resetData: {},
			save: sinon.stub().yields(null, { _id: 12587458 }),
		}
		findOneStub = sinon.stub().yields(null, user_to_find);
		saveStub = sinon.stub().yields(null, { _id: "0254879456" });
				
		//mongoose User model mock
		mockUser = function () {
			this.save = saveStub;

		};
		mockUser.findOne = findOneStub;
		sendResetMailstub = sinon.stub().yields(null);
		mockMailHelper = {
			sendResetMail: sendResetMailstub
		}

		controller = rewire("../../../server/controllers/user.api.controller");
		controller.__set__("User", mockUser);
		controller.__set__("mailHelper", mockMailHelper);

		done();
	})
	before(() => {
		app = express();
		expressConf(app);
		//mock jwt payload extraction
		app.use("/api", (req, res, next) => {
			req.user = { id: "12589541025", roles: ["user"] }
			next();
		});
		//fake routes
		app.get('/api/reset/:token', controller.validateResetToken);
		app.post('/api/account', controller.postAccount);
		app.put('/api/profile', controller.postProfile);
		app.post('/api/forgot', controller.forgot);
		app.post("/api/updateaccount", controller.updateAccount)

	});


	describe("Reset password test", () => {
		beforeEach(() => {
			//findOneStub = sinon.stub().yields(null, user_to_find);
		})
		afterEach(() => {
			findOneStub.reset();
			sendResetMailstub.reset();
		})
		it("Should redirect browser to angular route with given token as param", (done) => {
			findOneStub.yields(null, user_to_find);
			request(app)
				.get('/api/reset/fake_token_from_email')
				.expect(302)
				.end((err, res) => {
					expect(res.status).to.be.equal(302);
					expect(findOneStub.called).to.be.equal(true);
					expect(res.header['location']).to.be.equal("/password/reset/fake_token_from_email");
					done();
				});

		})
		it("Should redirect to error page if mongo error", (done) => {
			findOneStub.yields(new Error("Something awful has happened"), null);
			request(app)
				.get('/api/reset/fake_token_from_email')
				.expect(500)
				.end((err, res) => {
					expect(res.status).to.be.equal(500);
					expect(findOneStub.called).to.be.equal(true);
					done();
				});
		})
		it("Should redirect to error page if user with given token is not found", (done) => {
			//user with given reset token is not found, or expired
			findOneStub.yields(null, null);
			request(app)
				.get('/api/reset/fake_token_from_email')
				.expect(302)
				.end((err, res) => {
					expect(res.status).to.be.equal(302);
					expect(findOneStub.called).to.be.equal(true);
					expect(res.header['location']).to.be.equal("/password/error/");
					done();
				});
		})
		it("Should send email with reset instructions", (done) => {
			sendResetMailstub.yields(null); 
			findOneStub.yields(null, user_to_find);
			request(app)
				.post('/api/forgot')
				.send({ email: "fake@email.com" })
				.expect(200)
				.end((err, res) => {
					expect(res.status).to.be.equal(200);
					expect(findOneStub.calledOnce).to.be.equal(true);
					expect(sendResetMailstub.calledOnce).to.be.equal(true);
					done();
				});
		})
		it("Should fail sending email with 400 EC if email is empty", (done) => {
			sendResetMailstub.yields(null);
			findOneStub.yields(null, user_to_find);
			request(app)
				.post('/api/forgot')
				.send({ email: "" }) 
				.expect(400)
				.end((err, res) => {
					expect(res.status).to.be.equal(400);
					expect(findOneStub.calledOnce).to.be.equal(false);
					expect(sendResetMailstub.calledOnce).to.be.equal(false);
					done(); 
				});
		})
	})
		
	describe("Account and profile callbacks tests", () => {
		beforeEach(() => {
			//findOneStub = sinon.stub().yields(null, user_to_find);
		})
		afterEach(() => {
			findOneStub.reset();
		})
		it("Should return account data", (done) => {
			findOneStub.yields(null, user_to_find);
			request(app)
				.post('/api/account')
				.expect(200)
				.end((err, res) => {
					expect(res.status).to.be.equal(200);
					expect(findOneStub.calledOnce).to.be.equal(true);
					expect(res.body).to.have.property("username");
					done();
				});
		})
		it("Should return profile data", (done) => {
			findOneStub.yields(null, user_to_find);
			request(app)
				.put('/api/profile')
				.expect(200)
				.end((err, res) => {
					expect(res.status).to.be.equal(200);
					expect(findOneStub.calledOnce).to.be.equal(true);
					done();
				});
		})
		it("Should update successfully with proper data and valid credentials", (done)=>{			
			findOneStub.yields(null, user_to_find);
			request(app)
				.post('/api/updateaccount')
				.send({account:{oldpassword:"old",password:"new", email:"email", username:"username"}})
				.expect(200)
				.end((err, res) => {
					expect(res.status).to.be.equal(200);	
					expect(findOneStub.calledOnce).to.be.equal(true);						
					expect(findOneStub.calledWith({ _id: "12589541025" })).to.be.equal(true);
					expect(authenticateStub.calledWith("old")).to.be.equal(true);		
					expect(user_to_find.save.called).to.be.equal(true);
					done();
				});
		})
	})

}) 