var db = require(NODE_APPDIR + '/db');

var deleteBacklogItemHandler = (function () {
	
	//options => { backlog_id:string, backlog_items_ids:[], created_by:user }
	//callback => (error)
	var deleteItems = function(options, callback){
		var delete_event;
		
		if(options.backlog_items_ids.length === 0) {
			callback();
		}
		else
		{		
			delete_event = buildDeleteEvent({ id : options.backlog_items_ids.pop() });
			storeEvent(delete_event, options, callback);
		}
	};

	var buildDeleteEvent = function(data){
		return {		
			type : "DeletedBacklogItemEvent",			
			data : data,
			run : function(backlog){
				var removedItem = this.data.id;
				backlog.items = backlog.items.filter(function(item){
					return item._id.toString() !== removedItem.toString();
				});
			}
		};
	};

	var storeEvent = function (delete_event, options, callback) {
		var eventData = { event : delete_event, created_by : options.created_by };
		var readModelData = { backlog_id : options.backlog_id, backlog_item_id : delete_event.data.id };

		db.addEvent(options.backlog_id, eventData, function(error, ev){
			if(error != null) {
				console.log("backlogItem_delete_handler::storeEvent::error", error);
				callback("Could not delete item(s)");
			}
			else {
				updateReadModel(readModelData, options, callback);
			}
  	});
	};

	var updateReadModel = function(data, options, callback){
		var query = {'$pull': { items : {'_id': db.toObjectID(data.backlog_item_id) } } };
		db.updateBacklog(data.backlog_id, query, function(error){
			if(error != null) {
				console.log("backlogItem_delete_handler::updateReadModel::error", error);
				callback("Could not delete item(s)");
			}
			else {
				deleteItems(options, callback);
			}
		});
	};	

	return {
		deleteItems : deleteItems
	};
}());

module.exports = deleteBacklogItemHandler;