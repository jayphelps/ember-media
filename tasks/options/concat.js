var options = {
    banner: '<%= banner %>\n'
};

module.exports = {
    amd: {
        options: options,
        src: ['tmp/**/*.amd.js'],
        dest: 'dist/<%= package.name %>-<%= package.version %>.amd.js'
    },

    cjs: {
        options: options,
        src: ['tmp/**/*.cjs.js'],
        dest: 'dist/<%= package.name %>-<%= package.version %>.cjs.js'
    },

    vendor: {
        src: ['vendor/**/*.js', '!vendor/loader/*'],
        dest: 'tmp/vendor.amd.js'
    },

    tests: {
        src: ['tmp/tests/**/*_test.amd.js'],
        dest: 'tmp/tests.amd.js'
    },

    browser: {
        src: ['vendor/loader/loader.js', 'tmp/deps.amd.js', 'tmp/**/*.amd.js'],
        dest: 'tmp/<%= package.barename %>.browser.js'
    }
};