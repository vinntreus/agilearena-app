var mongo = require('mongoskin'),
	  format = require('dateformat');
    db = mongo.db('localhost:27017/agilearena?auto_reconnect');  

db.events = db.collection('events');
db.backlogs = db.collection('backlogs');

var setCreated = function(item, date){
	setObjectId(item, "_id");	
	item.created = item.created || date || new Date();		
}

var setObjectId = function(obj, prop){
	obj[prop] = obj[prop] || new db.ObjectID();
}

db.updateBacklog = function(itemId, updateOperation, callback){
	itemId = db.toObjectID(itemId);
	var item = {'_id': itemId};
	this.backlogs.update(item, updateOperation, callback);
};

db.addBacklogItem = function(backlogId, backlogItem, callback){	
	setCreated(backlogItem);
	db.updateBacklog(backlogId, {$push: {items:backlogItem}}, callback);
};


/*** Event store ***/

db.addEvent = function(aggregateId, eventToSave, callback){
	aggregateId = db.toObjectID(aggregateId);
	var query = { aggregateId : aggregateId};
	var params = {safe:true, serializeFunctions:true};	

	setCreated(eventToSave);	

	this.events.update(query, {'$push': { events : eventToSave}}, params, callback);
}; 

db.createAggregateRoot = function(root, createdEvent, callback){
	var params = {safe:true, serializeFunctions:true};
	var created = new Date();
	setObjectId(root, "aggregateId");	
	setCreated(root, created);	
	setCreated(createdEvent, created);
	setCreated(createdEvent.data, created);
	createdEvent.data._id = root.aggregateId;
	
	root.events = [createdEvent];

	db.events.insert(root, params, function(err, ev){
		if(err != null)
			throw err;

		callback(root);
	});
};

db.getAggregateVersion = function(aggregateId, type, version, callback){
	var id = db.toObjectID(aggregateId);
  db.events.findOne({ aggregateId : id } , {raw:true}, function(err, rawAggregate){
  	if(err != null)
  		throw err;  	

    var aggregate = db.bson_serializer.BSON.deserialize(rawAggregate, {evalFunctions:true, cacheFunctions:true});
    var root = buildAggregateRoot(aggregate.events, type, version);
    callback(root.aggregate, root.events);

  });
};

var buildAggregateRoot = function(events, domainObj, version){			
	var mappedEvents = events.map(function(e, index){			
		if(index <= version && e.run){
			domainObj = e.run(domainObj) || domainObj;
		}
		return { 
			type : eventTypes[e.type] || e.type,
			created : format(e.created, "yyyy-mm-dd HH:MM:ss"),
    	createdBy : e.data.createdBy || ""
    };
	});
	return {
		events : mappedEvents,
		aggregate : domainObj
	}
};

var eventTypes = { 
  CreatedBacklog : "Created backlog", 
  CreatedBacklogItemEvent : "Added item",
  DeletedBacklogItemEvent : "Removed item"
};

module.exports = db;