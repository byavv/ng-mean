
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
