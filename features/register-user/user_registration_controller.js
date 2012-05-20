var registration = require("./user_registration");

var user_registration_controller = {

  index : function(req, res){
    res.render("./register-user/user_registration", {title : "Register"});
  },
  register : function(req, res){
    console.log("registers user", req.body.user);
    
    registration.register(req.body.user, 
      function(user){
        res.render("./register-user/registered_user", {title : "Successfully registered", user : user});
    }, function(error){
        res.render("./register-user/user_registration", {title : "Register", error : error});
    });

  }
};

exports.index = user_registration_controller.index;
exports.register = user_registration_controller.register;