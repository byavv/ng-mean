'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  runSequence = require('run-sequence'),
  plugins = gulpLoadPlugins(),
  path = require('path'),
  gutil = require("gulp-util"),
  ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
// Mocha tests task

gulp.task("set_test", () => {
  process.env.NODE_ENV = 'test';
})
gulp.task('mocha', ["set_test"], () => {
  gulp.src(['test/server/**/*.spec.js'], { read: false })
    .pipe(plugins.mocha({
      reporter: 'spec'
    }))
    .on('error', gutil.log);
});

gulp.task("watch-mocha", ["set_test"], () => {
  gulp.run("mocha"); 
  gulp.watch(["server/**/*.js", "test/**/*.js"],["mocha"]);    
})

gulp.task('karma', function () {
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


gulp.task("compile", function () {
  var tsProject = ts.createProject('server/tsconfig.json');
  var tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));
  return tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/server'));
});
