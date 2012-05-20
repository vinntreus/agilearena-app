var login = {
  login_get : function(req, res){
    res.render('./login-logout/login', {title : "login"});
  }
};


exports.login_get = login.login_get;