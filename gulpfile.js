'use strict';

var _ = require('lodash'),
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  webpack = require("webpack"),
  path = require('path')
  ;

gulp.task("set_test", () => {
  process.env.NODE_ENV = 'test';
})

// test on Travis-CI (mocha exit when done)
gulp.task('mocha-on-travis', ["set_test"], () => {
  var mochaError;
  gulp.src(['test/server/**/*.spec.js'], { read: false })
    .pipe($.mocha({
      reporter: 'spec'
    }))
    .on('end', () => {
      if (mochaError) {
        console.log('Mocha encountered an error, exiting with status 1');
        console.log('Error:', mochaError.message);
        process.exit(1);
      }
      process.exit();
    })
    .on('error', (err) => {
      $.util.log('ERROR:', err.message);
      $.util.log('Stack:', err.stack);
      mochaError = err;
    });
});

// server coverage
gulp.task('istanbul', ["set_test"], () => {
  var mochaError;
  gulp.src(['./server/**/*.js'])
    .pipe($.istanbul({ includeUntested: false }))
    .pipe($.istanbul.hookRequire())
    .on('finish', () => {

      gulp.src(['./test/server/**/*.spec.js'])
        .pipe($.mocha())
        .on('error', (err) => {
          $.util.log($.util.colors.bgRed('ERROR:'), $.util.colors.red(err.message));
          $.util.log('Stack:', $.util.colors.red(err.stack));
          mochaError = err;
        })
        .pipe($.istanbul.writeReports({
          // reporters: ['lcov']
        }))
        .on('end', () => {
          if (mochaError) {
            console.log('Mocha encountered an error, exiting with status 1');
            console.log('Error:', mochaError.message);
            process.exit(1);
          }
          process.exit();
        });
    });
});

// test server (single)
gulp.task('mocha', ["set_test"], () => {
  gulp.src(['test/server/**/*.spec.js'], { read: false })
    .pipe($.mocha({
      reporter: 'spec'
    }))
    .on('end', () => {
      $.util.log($.util.colors.bgYellow('INFO:'), 'Mocha completed');
    })
    .on('error', (err) => {
      $.util.log($.util.colors.bgRed('ERROR:'), $.util.colors.red(err.message));
      $.util.log('Stack:', $.util.colors.red(err.stack));
    });
});

// test server (auto)
gulp.task("watch-mocha", ["set_test"], () => {
  gulp.run("mocha");
  gulp.watch(["server/**/*.js", "test/**/*.js"], ["mocha"]);
})

// test client (single)
gulp.task("karma", (done) => {
  startClientTests(true, done);
});

// test client (auto)
gulp.task("watch-karma", (done) => {
  startClientTests(false, done);
});
// e2e protractor
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

gulp.task('clean:build', () => {
  return (require('del'))('./build');
});
gulp.task("images", ["clean:build"], () => {
  return gulp.src("client/assets/images/*")
    .pipe($.imagemin({
      optimizationLevel: 4
    }))
    .pipe(gulp.dest("build/images"));
});
// build for production
gulp.task("build", ["images"], () => {
  var wpConfig = require("./server/config/webpack")("production");
  return gulp.src(__dirname + '/client/app/app.module.ts')
    .pipe($.webpack(wpConfig, webpack))
    .pipe(gulp.dest('./build/'));
});

// coveralls
gulp.task('coverage', [], () => {
  return gulp
    .src('./coverage/**/lcov.info')
    .pipe($.coveralls());
})

// dev task
gulp.task('default', ["images"], () => {
  // livereload Chrome extension 
  // extension: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
  $.livereload.listen();
  $.nodemon().on('restart', () => {
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