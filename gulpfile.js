'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'), 
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  runSequence = require('run-sequence'),
  plugins = gulpLoadPlugins(),
  path = require('path');

// Mocha tests task
gulp.task('mocha', function (done) {
  // Open mongoose connections
//  var mongoose = require('./config/lib/mongoose.js');
  var error;

  // Connect mongoose
//  mongoose.connect(function() {
    // Run the tests
    gulp.src(['test/server/**/*.spec.js'])
      .pipe(plugins.mocha({
        reporter: 'spec'
      }))
      .on('error', function (err) {
        // If an error occurs, save it
        error = err;
      })
      .on('end', function() {
        // When the tests are done, disconnect mongoose and pass the error state back to gulp
    //    mongoose.disconnect(function() {
     //     done(error);
     //   });
 //     });
  });

});

gulp.task('karma', function(){
   return gulp.src([])
    .pipe(plugins.karma({
      configFile: 'karma.conf.js',
      action: 'run',
      singleRun: true
    }));
})

gulp.task('protractor', function () {
  gulp.src([])
    .pipe(plugins.protractor.protractor({
      configFile: 'protractor.conf.js'
    }))
    .on('error', function (e) {
      throw e;
    });
});