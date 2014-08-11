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
        tasks: ['less']
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
        tasks: ['concat', 'uglify']
      }
    },
    bower: {
      install: {
        options: {
          targetDir: './public/third_party'
        }
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
    shell: {
      serve: {
        options: {
          stdout: true
        },
        command: './.bin/dev'
      }
    },
    concat: {
      dist: {
        src: [
          'public/third_party/jquery/dist/jquery.js',
          'public/third_party/bootstrap/dist/js/bootstrap.js',
          'public/third_party/handlebars/handlebars.js',
          'public/js/src/stream.js'
        ],
        dest: 'public/js/phant-manager.js',
      }
    },
    concurrent: {
      dev: {
        tasks: ['less', 'concat', 'uglify', 'watch', 'shell:serve']
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
    },
    uglify: {
      dest: {
        files: {
          'public/js/phant-manager.min.js': '<%= concat.dist.src %>'
        }
      }
    }
  });

  grunt.registerTask('default', ['jsbeautifier', 'bower', 'nodeunit', 'jshint', 'less', 'concat', 'uglify']);
  grunt.registerTask('dev', ['bower', 'concurrent:dev']);

};
