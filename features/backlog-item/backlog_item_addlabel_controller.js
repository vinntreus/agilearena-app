
var handler = require('./backlog_item_addlabel_handler');

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;
  app.post('/backlog-item/label', auth.ensureAuthenticated, addLabel);
};

//ACTIONS
var addLabel = function(req, res){  
  var ids = req.body.backlog_item_ids;
  
  console.log("ids", ids);

  var options = {
    backlogId : req.body.backlog_id,
    backlogItemId : ids.pop(),
    label : req.body.label,
    createdBy : req.user
  };

  handler.addLabel(options, function(error, itemId){
    if(error != null){
      res.send(error, 500);
    }
    else {      
      res.send({"_id" : itemId}, 200);
    }
  });  

  
};