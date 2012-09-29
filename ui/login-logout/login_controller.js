var login_get = function(req, res){
  res.render('./login-logout/login', {title : "login"});
};

exports.route = function(options){
  options.app.get('/login', login_get);  
  options.app.post('/login', options.passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
  }); 
  
  options.app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
};