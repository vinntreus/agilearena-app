var registration = require("./user_registration");
var passport;

//ROUTING
exports.route = function(options){
  passport = options.passport;
  options.app.get('/register', index);
  options.app.post('/register', register);
};

//ACTIONS
var index = function(req, res){
  render_registration_view(res, {title : "Register"});
};

var register = function(req, res, next){  
  registration.register(req.body.user, {
    success : function(user) {  
       req.logIn(user, function(err) {
        return res.redirect('/');
      });
    },
    failure : function(error){
      res.render("./register-user/user_registration", {title : "Register", error : error});
    } 
  });
};

//RENDER VIEW HELPER
var render_registration_view = function(res, model){
  res.render("./register-user/user_registration", model);
};