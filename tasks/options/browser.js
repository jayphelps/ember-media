module.exports = {
    options: {
        banner: '<%= banner %>'
    },
    dist: {
        src: 'tmp/<%= package.barename %>.browser.js',
        dest: 'dist/<%= package.name %>-<%= package.version %>.js'
    }
};