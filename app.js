NODE_APPDIR = __dirname;
var express = require('express');
var routes = require('./routing');
var compressor = require('node-minify');
var app = express();
var passport = require('passport');
var authentication = require('./authentication');
var RedisStore = require('connect-redis')(express);
console.log(__dirname + '/features');

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/features');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.session({ secret: 'monkey', store : new RedisStore() }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);    
});



app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});

authentication.setup(passport);

// Routes
routes.map(app, passport);
// Using Google Closure
/*new compressor.minify({
    type: 'gcc',
    fileIn: ['./public/libs/jquery-1.7.2.js', 
             './public/libs/bootstrap/js/bootstrap.js',
             './public/libs/knockout-2.1.0.debug.js'
            ],
    fileOut: './public/javascripts/scripts.js',
    callback: function(err){
        console.log("minify js errors",err);
    }
});
// Using YUI Compressor
new compressor.minify({
    type: 'yui',
    fileIn: ['./public/libs/bootstrap-spacelab/bootstrap.css', 
             './public/libs/bootstrap/css/bootstrap-responsive.css'
             ],
    fileOut: './public/stylesheets/styles.css',
    callback: function(err){
        console.log("minify css errors", err);
    }
});*/

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});