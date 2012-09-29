var sechash = require('sechash');
var db = require(NODE_APPDIR + '/db');


var validate = function(user, options){
  user = user || { username : "", password : ""};
  
  if(user.username === ''){
    return options.failure("Need username");
  }
  if(user.password === ''){
    return options.failure("Need password");
  }

  db.collection('users').findOne({ username : user.username}, function(err, doc){    
    if(err != null){
      console.log("ERROR [user_registration::validate] => Errors trying to find users", err);  
      return options.failure("Problems connecting to database");
    }
    if(doc != null){
      console.log("INFO [user_registration::validate] => Tried to create duplicate user", doc);
      return options.failure("User already exists");
    }
    options.success(user);
  });  
};



var storeCreatedUserEvent = function(userData, user, options){
  //assume user is just saved, now we create the event
  var userEvent = {
    aggregateId : user._id,
    type : "User",
    created : new Date(),
    data : user,
    events :[],
    getAggregate : function(ModelCtor){
      return new ModelCtor(this.data);
    }          
  };
  //store the event (including its functions)
  db.collection('events').insert(userEvent, {safe:true, serializeFunctions:true}, function(eventErr, eventResult){
    db.close();
    
    if(eventErr != null){
      console.log("ERROR [user_registration::storeCreatedUserEvent] => Could not store create-user-event", eventErr);      
      return options.failure("Could not save user-event");
    }          
    //both event and user is saved, now we return success
    options.success(user);
  });       
};

var storeUser = function(user, options){  
  db.collection('users').insert(user, function(userErr, userResult){
    if(userErr != null){
      console.log("ERROR [user_registration::storeUser] => Could not store user", userErr);
      db.close();
      return options.failure("Could not save user");
    }

    storeCreatedUserEvent(user, userResult[0], options);      
  });
};

exports.register = function(userData, options){

  validate(userData,{
    success : function(user){
      var hash = sechash.basicHash('sha1', user.password);
      var newUser = {
        username : user.username,
        password : hash
      };
      
      storeUser(newUser, options);
    },
    failure : function(error){
      options.failure(error);
    }
  });
  
};