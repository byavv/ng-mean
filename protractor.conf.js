exports.config =
{
  specs: ['./test/e2e/**/*.spec.js'],
  baseUrl: 'http://localhost:3030/',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {
    'browserName': 'chrome'
  },
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () { },
  },
  framework: 'mocha',
  mochaOpts: {
    reporter: 'spec',
    slow: 3000
  }
}