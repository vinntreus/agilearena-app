var home = require('./features/startpage/home_controller');
var login = require('./features/login-logout/login_controller');
var registerUser = require('./features/register-user/user_registration_controller');
var backlog = require('./features/backlog/backlog_controller');

var auth = require('./authentication');

exports.map = function(app, passport){
  //root
  app.get('/', auth.ensureAuthenticated, home.index);

  //login
  app.get('/login', login.login_get);  
  app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
  });
  
  //logout
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  //register-user
  app.get('/register', registerUser.index);
  app.post('/register', registerUser.register);

  //create backlog
  app.post('/backlog/create', auth.ensureAuthenticated, backlog.create_post); 
  app.get('/backlog/create', auth.ensureAuthenticated, backlog.create_get); 
  
  //display backlog
  app.get('/backlogs/:id', backlog.show);   
};