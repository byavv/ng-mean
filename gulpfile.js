'use strict';

var _ = require('lodash'),
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  runSequence = require('run-sequence'),
  webpack = require("webpack"),
  path = require('path'),
  webpackConfig = require("./server/config/webpack")("production");


gulp.task("set_test", () => {
  process.env.NODE_ENV = 'test';
})
gulp.task('mocha', ["set_test"], () => {
  gulp.src(['test/server/**/*.spec.js'], { read: false })
    .pipe($.mocha({
      reporter: 'spec'
    }))
    .on('error', $.util.log);
});

gulp.task("watch-mocha", ["set_test"], () => {
  gulp.run("mocha");
  gulp.watch(["server/**/*.js", "test/**/*.js"], ["mocha"]);
})

//start tests (single)
gulp.task("karma", function (done) {
  startClientTests(true, done);
});

//start tests (auto)
gulp.task("watch-karma", function (done) {
  startClientTests(false, done);
});

gulp.task('protractor', function () {
  gulp.src([])
    .pipe($.protractor.protractor({
      configFile: 'protractor.conf.js'
    }))
    .on('error', function (e) {
      throw e;
    });
});

//build for production
gulp.task("build", ["images"], function () {
  return gulp.src(__dirname + '/client/app/app.module.ts')
    .pipe($.webpack(webpackConfig, webpack))
    .pipe(gulp.dest('./build/'));
});
gulp.task("images", function () {
  return gulp.src("client/assets/images/*")
    .pipe($.imagemin({
      optimizationLevel: 4
    }))
    .pipe(gulp.dest("build/images"));
});

// dev task
gulp.task('default',["images"], function() {
    // do not forget to install livereload Chrome extension
    // https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
    $.livereload.listen();
    $.nodemon().on('restart', function(){
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
  }, function (res) {
    if (res === 1) {
      $.util.log($.util.colors.white.bgRed.bold("FAIL!"));
    } else {
      $.util.log($.util.colors.white.bgGreen.bold("SUCCESS!"));
    }
    done();
  });
  server.start();
}