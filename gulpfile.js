var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    Server = require('karma').Server;
 

gulp.task('build.app', function () {
    return gulp.src('app/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            out: 'app.js',
            target: 'ES5'
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('build.tests', function () {
    return gulp.src('tests/**/*.ts')
        .pipe(ts({
            noImplicitAny: false,
            out: 'tests.js',
            target: 'ES5'
        }))
        .pipe(gulp.dest('tests'));
});

var karmaConf = __dirname + '/karma.conf.js';

gulp.task('test', function (done) {
  new Server({
    configFile: karmaConf,
    singleRun: true
  }, done).start();
});

gulp.task('tdd', ['build.tests'], function (done) {
  gulp.watch(['tests/*.ts','app/*.ts'], ['build.tests']);
  new Server({
    configFile: karmaConf,
    singleRun: false
  }, done).start();
});

gulp.task('watch', ['build.app'], function() {
    gulp.watch('app/*.ts', ['build.app']);
});