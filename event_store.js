var db = require(NODE_APPDIR + '/db'),
	format = require('dateformat');

var eventStore = (function(){
	var _updateParams = { safe:true, serializeFunctions:true };

	var addEvents = function(aggregateId, events, createdBy, callback){
		var eventsToSave = events.map(function(e){ return db.setCreated(e, createdBy); });
		var updateOperation = {'$pushAll': { events : eventsToSave }};
		_updateEvents(aggregateId, updateOperation, function(err, itemsAffected){
			callback(err, eventsToSave);
		});
	};

	var _updateEvents = function(aggregateId, updateOperation, callback){
		aggregateId = db.toObjectID(aggregateId);
		var query = { aggregateId : aggregateId };		
		db.events.update(query, updateOperation, _updateParams, callback);
	};	

	var createAggregateRoot = function(root, createdEvent, createdBy, callback){		
		root.aggregateId = createdEvent.data._id = new db.ObjectID();
		[root, createdEvent, createdEvent.data].forEach(function(e){ db.setCreated(e, createdBy)});

		root.events = [createdEvent];

		db.events.insert(root, _updateParams, function(err, ev){
			callback(root);
		});		
	};

	/*
	/* @aggregateId: string
	/* @type : function constructor
	/* @version : number, null = all versions
	/* @callback : function(aggregate, events)
	*/
	var getAggregateRoot = function(aggregateId, type, version, callback){
		var id = db.toObjectID(aggregateId);
	  db.events.findOne({ aggregateId : id } , {raw:true}, function(err, rawAggregate){
	  	if(err != null)
	  		throw err;  	

	    var aggregate = db.bson_serializer.BSON.deserialize(rawAggregate, {evalFunctions:true, cacheFunctions:true});
	    var root = _buildAggregateRoot(aggregate.events, type, version);
	    callback(root.aggregate, root.events);
	  });
	};

	var _buildAggregateRoot = function(events, domainObj, version){			
		var mappedEvents = events.map(function(e, index){			
			if( (index <= version || version == null) && e.run){
				domainObj = e.run(domainObj) || domainObj;
			}
			return { 
				type : _eventTypes[e.type] || e.type,
				created : format(e.created, "yyyy-mm-dd HH:MM:ss"),
	    	createdBy : e.createdBy || ""
	    };
		});
		return {
			events : mappedEvents,
			aggregate : domainObj
		}
	};

	var _eventTypes = { 
	  CreatedBacklog : "Created backlog", 
	  CreatedBacklogItemEvent : "Added item",
	  DeletedBacklogItemEvent : "Removed item"
	};

	return {
		addEvents : addEvents,
		createAggregateRoot : createAggregateRoot,
		getAggregateRoot : getAggregateRoot
	};

}());

module.exports = eventStore;