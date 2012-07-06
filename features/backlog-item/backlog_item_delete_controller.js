var db = require(NODE_APPDIR + '/db');
var handler = require('./backlog_item_delete_handler');

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;  
  app.post('/backlog-item/delete', auth.ensureAuthenticated, delete_backlogitem); 
};

//ACTIONS
var delete_backlogitem = function(req, res){  
  var options = { 
  	backlog_id : req.body.backlog_id,
  	backlog_items_ids : req.body.items,
  	created_by : req.user
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