var db = require(NODE_APPDIR + '/db');

//ACTIONS
//TODOS: DO PROPER AUTHORIZATION, ERROR-HANDLING, DELETE_EVENT
var delete_backlog = function(req, res){
  
  var backlogId = db.toObjectID(req.params.id); 

  db.backlogs.remove(
    { 
      _id : backlogId, 
      owner : req.user._id
    }, 
    { 
      safe : true
    },
    function(err, numberOfRemovedDocs){   
      db.close();
      res.redirect('/');
    }
  );
};

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;
  app.del('/backlogs/:id', auth.ensureAuthenticated, delete_backlog);
};