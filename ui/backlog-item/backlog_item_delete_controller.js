var db = require(NODE_APPDIR + '/db');
var handler = require(NODE_APPDIR + '/commands/backlogitem_delete');

//ACTIONS
var delete_backlogitem = function(req, res){  
  var options = { 
    backlogId : req.body.backlog_id,
    backlogItemsIds : req.body.items,
    user : req.user
  };

  handler.deleteItems(options, function(error){
    if(error != null) {
      res.send("Could not delete items", 500);
    }
    else {
      res.send('', 200);
    }		
  });	
};

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;  
  app.post('/backlog-item/delete', auth.ensureAuthenticated, delete_backlogitem); 
};