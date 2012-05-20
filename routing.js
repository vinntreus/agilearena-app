var auth = require('./authentication');
var features = require('./dir_loader').load('./features/');

exports.map = function(app, passport){
  //root
  app.get('/', auth.ensureAuthenticated, features.home_controller.index);

  //login
  app.get('/login', features.login_controller.login_get);  
  app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
  });
  
  //logout
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  //register-user
  app.get('/register', features.user_registration_controller.index);
  app.post('/register', features.user_registration_controller.register);

  //display backlog  
  app.get('/backlogs/:id', auth.ensureAuthenticated, features.backlog_show.show);

  //create backlog
  app.post('/backlog/create', auth.ensureAuthenticated, features.backlog_create.create_post); 
  app.get('/backlog/create', auth.ensureAuthenticated, features.backlog_create.create_get); 
  
  
  //delete backlog
  app.del('/backlogs/:id', auth.ensureAuthenticated, features.backlog_delete.delete);
  //admin backlog
  app.get('/backlogs/:id/admin', auth.ensureAuthenticated, features.backlog_admin.admin);
};