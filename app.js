NODE_APPDIR = __dirname;
var express = require('express');
var routes = require('./routing');
var compressor = require('node-minify');
var app = express();
var passport = require('passport');
var authentication = require('./authentication');
var RedisStore = require('connect-redis')(express);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/ui');
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

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});