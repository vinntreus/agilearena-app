var handler = require('./backlog_item_create_handler');

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;
  app.post('/backlog-item/create', auth.ensureAuthenticated, create_backlogitem);   
};

//ACTIONS
var create_backlogitem = function(req, res){  
  var backlog_id = req.body.backlog_id;
  var backlog_item = req.body.backlog_item;
  backlog_item.createdBy = req.user.username;
  backlog_item.createdById = req.user._id;

  handler.createBacklogItem(backlog_id, backlog_item, function(error, itemId){
    if(error != null){
      res.send("Could not save item", 500);
    }
    else{
      res.send({"_id" : itemId}, 200);
    }
  });  
};