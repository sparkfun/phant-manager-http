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
        src: 'index.js'
      },
      routes: {
        src: 'routes/*.js'
      }
    },
    watch: {
      less: {
        files: 'less/*.less',
        tasks: ['shell:build']
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      app: {
        files: '<%= jshint.app.src %>',
        tasks: ['jshint:app']
      },
      routes: {
        files: 'routes/*.js',
        tasks: ['jshint:routes']
      }
    },
    shell: {
      serve: {
        options: {
          stdout: true
        },
        command: './.bin/dev'
      },
      build: {
        command: './.bin/build'
      }
    },
    concurrent: {
      dev: {
        tasks: ['watch', 'shell:serve']
      },
      options: {
        logConcurrentOutput: true
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'shell:build']);
  grunt.registerTask('dev', ['concurrent:dev']);

};
