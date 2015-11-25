require('phantomjs-polyfill');
require('angular');
require('angular-mocks');

var context = require.context('./test/client', true, /\.spec\.ts/);
context.keys().forEach(context);
