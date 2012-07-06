var db = require(NODE_APPDIR + '/backlog_repository'),
    es = require(NODE_APPDIR + '/event_store'),
    Backlog = require(NODE_APPDIR + '/domain/backlog');

var deleteBacklogItemHandler = (function () {
	//callback => (error)
	var deleteItems = function(options, callback){		
		var backlogId = options.backlogId;
		var backlogItemsIds = options.backlogItemsIds;
		var user = options.user;						

		es.getAggregateRoot(backlogId, Backlog, null, function(backlog, ev){
			var events = buildEvents(backlog, backlogItemsIds, user._id);
			storeEvents(backlogId, events, user, callback);
		});		
	};

	var buildEvents = function(backlog, itemIds, userId){
		return itemIds.filter(function(id){			
			return backlog.deleteItem(id, userId);
		}).map(function(id){
			return buildDeleteEvent({ id : id});
		});;
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

	var storeEvents = function (backlogId, events, user, callback) {
		es.addEvents(backlogId, events, user, function(error, items){			
			if(error != null) {
				console.log("backlogItemDelete::storeEvent::error", error);
				return callback("Could not delete item(s)");
			}			
			var itemIds = items.map(function(i){ return i.data.id});
			updateReadModel(backlogId, itemIds, callback);
  	});
	};

	var updateReadModel = function(backlogId, backlogItemIds, callback){		
		db.removeBacklogItems(backlogId, backlogItemIds, function(error){
			var errorMessage;
			if(error != null) {
				console.log("backlogItemDelete::updateReadModel::error", error);
				errorMessage ="Could not delete item(s)";
			}
			callback(errorMessage);
		});
	};	

	return {
		deleteItems : deleteItems
	};
}());

module.exports = deleteBacklogItemHandler;