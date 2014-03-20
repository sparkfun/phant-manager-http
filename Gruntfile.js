'use strict';

module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      app: {
        src: 'app.js'
      }
    },
    less: {
      development: {
        files: {
          "public/css/phant.css": "less/phant.less"
        }
      },
      production: {
        options: {
          cleancss: true,
          sourceMap: true
        },
        files: {
          "public/css/phant.min.css": "less/phant.less"
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'less']);

};
