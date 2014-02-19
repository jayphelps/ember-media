var path = require('path');

module.exports = function (grunt) {
    var cwd = process.cwd();

    require('./tasks/browser')(grunt);

    var config = require('load-grunt-config')(grunt, {
        configPath: path.join(cwd, 'tasks', 'options')
    });

    this.registerTask('default', ['build']);

    this.registerTask('build', 'Builds a distributable version of <%= package.name %>', [
        'clean',
        'transpile:amd',
        'transpile:commonjs',
        'concat:vendor',
        'concat:amd',
        'concat:cjs',
        'concat:browser',
        'browser:dist',
        'uglify:all'
    ]);

    this.registerTask('server', [
        'build',
        'connect',
        'watch'
    ]);
};