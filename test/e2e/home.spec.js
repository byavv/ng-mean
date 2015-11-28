/**
 * File: e2e.js
 * Created by kpe on 29-Mar-2014 at 10:46 PM.
 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

describe('no protractor at all', function() {
	it('should still do normal tests', function() {
		expect(true).to.equal(true);
	});
});

describe('protractor library', function() {
	it('should expose the correct global variables', function () {
		expect(protractor).to.exist;
		expect(browser).to.exist;
		expect(by).to.exist;
		expect(element).to.exist;
		expect($).to.exist;
	});
});
/*
describe('chat app',function(){
	it('should redirect to #/chat', function() {
		browser.get('/dev');
		browser.getCurrentUrl().then(function(url){
			expect(url.substr("http://localhost:8080".length)).to.equal('/dev#/chat');
		});
	});

	it('should send chat messages', function(){
		var msgInput = element(by.model('msgInput'));
		msgInput.sendKeys('Hello, Chat!\n');
		msgInput.getText().then(function(text){
			expect(text).to.equal('');
			var msg = element(by.repeater('msg in room.messages').row(0).column('content'));
			msg.getText().then(function(msgText){
				 expect(msgText).to.equal('Hello, Chat!');
			});
		});
	});
});*/