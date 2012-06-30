var db = require(NODE_APPDIR + '/db');

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;  
  app.post('/backlog-item/delete', auth.ensureAuthenticated, delete_backlogitem); 
};

//ACTIONS
var delete_backlogitem = function(req, res){
  //res.send({backlog: req.body.backlog_id, items : req.body.items });
  var backlog_id = db.toObjectID(req.body.backlog_id);
  var items = req.body.items;  

  items.forEach(function(item_id){
  	var backlog_item_id = db.toObjectID(item_id);
  	var query = {'_id': backlog_id};
  	var data = {'$pull': { items : {'_id': backlog_item_id } } };
  	db.collection('backlogs').update(query, data, function(err, backlog){
	    if(err == null){
	    	console.log("removed backlogitem");
	    	on_deleted(backlog_id, backlog_item_id, res);
	    }
	    else{
	    	console.log("COULD NOT REMOVE");
	    }
  	});
  });   

};

var on_deleted = function(backlog_id, item_id, res){
	var deleted_event = get_on_deleted_event(item_id);
	db.addEvent(backlog_id, deleted_event, function(err, ev){
		if(err == null){
			console.log("added deleted event");			
			res.send('', 200);
		}
		else{
			console.log("COULD NOT add deleted event");
		}
	});
};
var get_on_deleted_event = function(item_id){
	return {
		_id : new db.ObjectID(),
		type : "DeletedBacklogItemEvent",
		created : new Date(),
		data : item_id,
		run : function(backlog){
			var that = this;			
			backlog.items = backlog.items.filter(function(item){
				return item._id !== that.data;
			});
		}
	};
}