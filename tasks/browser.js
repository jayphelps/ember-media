module.exports = function (grunt) {
    grunt.registerMultiTask('browser', 'Export the object in <%= package.name %> to the root object. (Usually window, in the browser)', function () {
        var options = this.options(),
            banner = options.banner;

        this.files.forEach(function (file) {
            var output = [];

            output.push(banner);
            output.push('(function (root) {');
            output.push.apply(output, file.src.map(grunt.file.read));
            output.push(grunt.config.process('root.EmberMedia = require(\'<%= package.name %>\');'));
            output.push('})(this);');

            grunt.file.write(file.dest, output.join('\n'));
        });
    });
};