'use strict';

module.exports = function(grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js']
    },
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
        tasks: ['nodeunit', 'jshint:app']
      },
      routes: {
        files: 'routes/*.js',
        tasks: ['nodeunit', 'jshint:routes']
      },
      publicjs: {
        files: 'public/js/src/**/*.js',
        tasks: ['shell:build']
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
        options: {
          stdout: true,
          failOnError: true
        },
        command: './build'
      }
    },
    concurrent: {
      dev: {
        tasks: ['shell:build', 'watch', 'shell:serve']
      },
      options: {
        logConcurrentOutput: true
      }
    },
    jsbeautifier: {
      files: [
        'Gruntfile.js',
        'index.js',
        'routes/*.js',
        'test/*.js'
      ],
      options: {
        js: {
          indentChar: ' ',
          indentSize: 2
        }
      },
    }
  });

  grunt.registerTask('default', ['jsbeautifier', 'nodeunit', 'jshint', 'shell:build']);
  grunt.registerTask('dev', ['concurrent:dev']);

};
