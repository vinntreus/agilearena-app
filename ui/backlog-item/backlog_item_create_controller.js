var handler = require(NODE_APPDIR + '/commands/backlogitem_create');

//ACTIONS
var createBacklogItem = function(req, res){  
  var options = {
    backlogId : req.body.backlog_id,
    backlogItem : req.body.backlog_item,
    createdBy : req.user
  };

  handler.createBacklogItem(options, function(error, itemId){
    if(error != null){
      res.send(error, 500);
    }
    else {
      res.send({"_id" : itemId}, 200);
    }
  });  
};

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;
  app.post('/backlog-item/create', auth.ensureAuthenticated, createBacklogItem);
};