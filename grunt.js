/*global module:false*/
module.exports = function(grunt) {
  

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['grunt.js', 'domain/**/*.js', 'ui/**/*.js']
    },
    simplemocha: {
      all: {
        src: 'test/**/*.js'
        
      }
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: ['<config:lint.files>','test/**/*.js' ],
      tasks: 'lint simplemocha'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      },
      globals: {
        jQuery: true,
        module: true,
        require: true,
        exports : true,
        console : true,
        NODE_APPDIR : true
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-simple-mocha');

  // Default task.
  grunt.registerTask('default', 'lint simplemocha');

  grunt.registerTask('replay', 'Clears readstore and replay events', function(){
    grunt.log.writeln('Starting to clear readstore...');
    var done = this.async();

    var replay = require('./event_replay');
    replay.run(grunt, done);
  });

  grunt.registerTask('clear', 'Clears readstore and events', function(){
    var done = this.async();

    var replay = require('./event_replay');
    replay.clear(grunt, done);
  });

};
