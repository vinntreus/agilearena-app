var registration = require(NODE_APPDIR + "/commands/user_registration");

//ACTIONS
var index = function(req, res){
  res.render("./register-user/user_registration", {title : "Register"});
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

//ROUTING
exports.route = function(options){
  options.app.get('/register', index);
  options.app.post('/register', register);
};