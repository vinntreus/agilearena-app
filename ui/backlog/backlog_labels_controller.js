var handler = require(NODE_APPDIR + '/commands/backlog_labels');

var addLabel = function(req, res){ 

  var data = {    
    label : req.body.label,
    backlogId : req.body.backlog_id,
    createdBy : req.user
  }; 

  handler.addLabel(data, function(error, itemId){
    if(error != null){ res.send(error, 500); }
    else {
      res.send({}, 200);
    }
  });  
};

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;

  app.post('/backlog/label', auth.ensureAuthenticated, addLabel); 
};