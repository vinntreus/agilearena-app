var mongo = require('mongoskin'),
    db = mongo.db('localhost:27017/agilearena?auto_reconnect');  

var events = db.collection('events'),
		backlogs = db.collection('backlogs');

db.addEvent = function(aggregateId, eventToSave, callback){
	var query = { aggregateId : aggregateId};
	var params = {safe:true, serializeFunctions:true};	

	eventToSave._id = eventToSave._id || new db.ObjectID();
	eventToSave.created = eventToSave.created || new Date();	

	events.update(query, {'$push': { events : eventToSave}}, params, callback);
}; 

db.updateBacklog = function(itemId, updateOperation, callback){
	var item = {'_id': itemId};
	backlogs.update(item, updateOperation, callback);
};

module.exports = db;