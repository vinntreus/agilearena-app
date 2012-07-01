var db = require(NODE_APPDIR + '/db');

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;  
  app.post('/backlog-item/delete', auth.ensureAuthenticated, delete_backlogitem); 
};

//ACTIONS
var delete_backlogitem = function(req, res){  
  var options = { 
  	backlog_id : db.toObjectID(req.body.backlog_id),
  	items : req.body.items,
  	created_by : req.user.username,
  	created_by_id : db.toObjectID(req.user._id)
  };

  delete_items(options, function(){
		res.send('', 200);
  });	

};

var delete_items = function(options, callback){
		var backlog_item_id = db.toObjectID(options.items.pop());  	
  	var query = {'$pull': { items : {'_id': backlog_item_id } } };

  	db.updateBacklog(options.backlog_id, query, function(err, backlog){
	    if(err == null){	    	
	    	var on_deleted_event = get_on_deleted_event({ id : backlog_item_id, createdBy : options.created_by }, options.created_by_id);
	    	db.addEvent(options.backlog_id, on_deleted_event, function(err, ev){
					if(err != null){
						console.log("could not add deleted event");
						throw err;			
					}
					if(options.items.length > 0){ //have more items to delete
						delete_items(options, callback);
					}
					else{
						callback();
					}
	    	});
	    }
	    else{
	    	console.log("Count not delete backlogitem");
	    	throw err;
	    }
  	});
}

var get_on_deleted_event = function(data, userId){
	return {		
		type : "DeletedBacklogItemEvent",		
		createdById : userId,
		data : data,
		run : function(backlog){
			var removedItem = this.data.id;
			backlog.items = backlog.items.filter(function(item){
				return item._id.toString() !== removedItem.toString();
			});
		}
	};
}