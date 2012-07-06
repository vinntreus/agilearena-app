
var handler = require('./backlog_item_create_handler');

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;
  app.post('/backlog-item/create', auth.ensureAuthenticated, create_backlogitem);   
};

//ACTIONS
var create_backlogitem = function(req, res){  
  var options = {
    backlog_id : req.body.backlog_id,
    backlog_item : req.body.backlog_item,
    created_by : req.user
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