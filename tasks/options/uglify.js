module.exports = {
    all: {
        options: {
            sourceMap: true,
            preserveComments: 'some'
        },

        src: 'dist/<%= package.name %>-<%= package.version %>.js',
        dest: 'dist/<%= package.name %>-<%= package.version %>.min.js'
    }
};