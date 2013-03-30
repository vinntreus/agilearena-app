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
      css : {
        src : ['public/libs/bootstrap-simplex/bootstrap.css',
               'public/libs/bootstrap/css/bootstrap-responsive.css',
               'public/site.css'],
        dest : 'public/dist/styles.css'
      },
      dist: {
        src: ['public/libs/jquery-1.8.2.js', 
              'public/libs/underscore.js', 
              'public/libs/bootstrap/js/bootstrap.js',
              'public/aa.*.js'],
        dest: 'public/dist/scripts.js'
      }
    },    
    min: {     
      dist: {
        src: ['public/dist/scripts.js'],
        dest: 'public/dist/scripts.min-<%= grunt.template.today("yyyymmdd") %>.js'
      }
    },    
    mincss: {
      compress: {
        files: {
          'public/dist/styles.min-<%= grunt.template.today("yyyymmdd") %>.css': ['public/dist/styles.css']
        }
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
  grunt.loadNpmTasks('grunt-contrib-mincss');

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

  grunt.registerTask('test', 'simplemocha');
  grunt.registerTask('css', 'concat:css mincss');
  grunt.registerTask('js', 'concat:dist min:dist');
};
