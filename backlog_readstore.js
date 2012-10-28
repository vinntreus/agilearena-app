var db = require(NODE_APPDIR + '/db');

var backlogReadstore = (function(){

	var addLabel = function(backlogId, label, callback){
		_updateBacklog(backlogId, {$push: {labels:label}}, callback);
	};

	var addLabelToBacklogItem = function(backlogId, data, callback){
		if(!data.item_ids){
			callback("Could not update labels in read store, no item ids");
		}
		else {
			for(var id in data.item_ids){
				var query = { '_id' : db.toObjectID(backlogId), 'items._id' : db.toObjectID(id) };
				var updateOperation = {$set : {'items.$.labels': data.item_ids[id].labels || []}};				
				db.backlogs.update(query, updateOperation, callback);
			}
		}
	};

	var addBacklogItem = function(backlogId, backlogItem, callback){			
		_updateBacklog(backlogId, {$push: {items:backlogItem}}, callback);
	};

	var removeBacklogItems = function(backlogId, backlogItemIds, callback){	
		backlogItemIds = backlogItemIds.map(function(b){
			return db.toObjectID(b);
		});
		var query = {'$pull': { items : { '_id' : { $in : backlogItemIds } } } };
		_updateBacklog(backlogId, query, callback);		
	};

	var _updateBacklog = function(backlogId, updateOperation, callback){		
		backlogId = { '_id' : db.toObjectID(backlogId) };
		db.backlogs.update(backlogId, updateOperation, callback);
	};

	return {
		removeBacklogItems : removeBacklogItems,
		addBacklogItem : addBacklogItem,
		addLabel : addLabel,
		addLabelToBacklogItem : addLabelToBacklogItem
	};

}());

module.exports = backlogReadstore;