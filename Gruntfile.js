module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ts');

  grunt.initConfig({

    clean: ["dist"],

    copy: {
      src_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/*.js', '!**/*.scss'],
        dest: 'dist'
      },
      pluginDef: {
        expand: true,
        src: ['README.md'],
        dest: 'dist'
      }
    },

    watch: {
      rebuild_all: {
        files: ['src/**/*'],
        tasks: ['watch-ts'],
        options: {spawn: false}
      }
    },

    ts: {
        options: {
          module: 'system', //or commonjs
          target: 'es5', //or es5
          rootDir: 'dist/',
          keepDirectoryHierarchy: false,
          declaration: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          sourceMap: true,
            noImplicitAny: false,
            moduleResolution: 'node',
            allowSyntheticDefaultImports: true
        },
        build: {
            src: ['dist/**/*.ts', "!src/spec/**/*", "!**/*.d.ts"],
            dest: 'dist/'
        }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['dist/test/spec/test-main.js', 'dist/test/spec/*_spec.js']
      }
    }
  });

  grunt.registerTask('default', [
    'clean',
    'copy:src_to_dist',
    'copy:pluginDef',
    'ts:build',
    //'typescript:distTests',
      //'babel',
    //'mochaTest'
  ]);

  grunt.registerTask('watch-ts', [
    'clean',
    'copy:src_to_dist',
    'copy:pluginDef',
    'ts:build'
  ]);
};
