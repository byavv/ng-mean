exports.config =
{
    specs: ['./test/e2e/**/*.spec.js'],
    baseUrl: 'http://localhost:3030/',
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },
    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        print: function() {},
        
    },
    onPrepare: function() {
      var SpecReporter = require('jasmine-spec-reporter');
      // add jasmine spec reporter
      jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all', prefixes: {
    success: 'v ',
    failure: 'x ',
    pending: '* '
  }}));
   },
   
}