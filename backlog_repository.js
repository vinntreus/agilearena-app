var db = require(NODE_APPDIR + '/db');

var backlogRepository = (function(){

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
		addBacklogItem : addBacklogItem
	};

}());

module.exports = backlogRepository;