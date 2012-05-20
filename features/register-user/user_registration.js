var sechash = require('sechash');
var Users = require('../../domain/user')

var validate = function(user, onSuccess, onFailure){
  user = user || { username : "", password : ""};
  
  if(user.username === ''){
    return onFailure("Need username");
  }
  if(user.password === ''){
    return onFailure("Need password");
  }

  Users.findOne({ username : user.username}, function(err, doc){    
    if(err != null){
      console.log("Errors trying to find users", err);  
      return onFailure("Problems connecting to database");
    }
    if(doc != null){
      return onFailure("User already exists");
    }
    onSuccess(user);
  });  
};

exports.register = function(userData, onSuccess, onFailure){
  validate(userData, function(user){
    var hash = sechash.basicHash('sha1', user.password);
    var newUser = new Users();
    newUser.username = user.username;
    newUser.password = hash;
    newUser.save(function(err){
      if(err == null){
        console.log("created user", newUser);
        return onSuccess(newUser);    
      }        
      return onFailure("Troubles saving user to db");
    });    
  }, onFailure);
};