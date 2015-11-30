'use strict';

var _ = require('lodash'),
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  runSequence = require('run-sequence'),
  webpack = require("webpack"),
  path = require('path')
  ;


gulp.task("set_test", () => {
  process.env.NODE_ENV = 'test';
})
gulp.task('mocha-on-travis', ["set_test"], () => {
  var mochaError;
  var handleMochaError = (err) => {
    console.log('Mocha encountered an error, exiting with status 1');
    console.log('Error:', err.message);
    process.exit(1);
  };
  gulp.src(['test/server/**/*.spec.js'], { read: false })
    .pipe($.mocha({
      reporter: 'spec'
    }))
    .on('end', () => {
      if (mochaError) return handleMochaError(mochaError);
      process.exit();
    })
    .on('error', (err) => {
      $.util.log('ERROR:', err.message);
      $.util.log('Stack:', err.stack);
      mochaError = err;
    });
});


gulp.task("watch-mocha", ["set_test"], () => {
  //gulp.run("mocha");
  gulp.watch(["server/**/*.js", "test/**/*.js"], ["mocha"]);
})

//start tests (single)
gulp.task("karma", (done) => {
  startClientTests(true, done);
});

//start tests (auto)
gulp.task("watch-karma", (done) => {
  startClientTests(false, done);
});

gulp.task('protractor', () => {
  gulp.src([])
    .pipe($.angularProtractor({
      'configFile': 'protractor.conf.js',
      'args': ['--baseUrl', 'http://localhost:3030'],
      'autoStartStopServer': true,
      'debug': true
    }))
    .on('error', function (e) {
      console.log(e);
    })
    .on('end', () => { });
});

//build for production
gulp.task("build", ["images"], () => {
  var wpConfig = require("./server/config/webpack")("production");
  return gulp.src(__dirname + '/client/app/app.module.ts')
    .pipe($.webpack(wpConfig, webpack))
    .pipe(gulp.dest('./build/'));
});
gulp.task("images", () => {
  return gulp.src("client/assets/images/*")
    .pipe($.imagemin({
      optimizationLevel: 4
    }))
    .pipe(gulp.dest("build/images"));
});

gulp.task('coverage', [], function () {
  //http://stackoverflow.com/questions/25434794/gulp-coveralls-returns-422-no-travisci-builds-can-be-found
  return gulp
    .src('./coverage/**/lcov.info')
    .pipe($.coveralls());
})

// dev task
gulp.task('default', ["images"], function () {
  // livereload Chrome extension 
  // https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
  $.livereload.listen();
  $.nodemon().on('restart', function () {
    gulp.src('server/server.js')
      .pipe($.livereload())
      .pipe($.notify('Reloading page, please wait...'));
  })
});

function startClientTests(single, done) {
  single = single || false;
  var Server = require("karma").Server;
  var server = new Server({
    configFile: __dirname + "/karma.conf.js",
    singleRun: single,
    autoWatch: !single
  }, (res) => {
    if (res === 1) {
      $.util.log($.util.colors.white.bgRed.bold("FAIL!"));
    } else {
      $.util.log($.util.colors.white.bgGreen.bold("SUCCESS!"));
    }
    done();
  });
  server.start();
}