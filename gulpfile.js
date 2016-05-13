var gulp = require('gulp');
var jsFiles = ['*.js', 'src/**/*.js'];
var nodemon = require('nodemon');


gulp.task('serve', [], function () {
    var options = {
        script: 'server.js',
        delayTime: 1,
        env: {
            'PORT': 4004
        },
        watch: jsFiles
    };
    return nodemon(options)
        .on('restart', function (ev) {
            console.log('Hey restarting ....');
        });
});