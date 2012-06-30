var mongo = require('mongoskin'),
    db = mongo.db('localhost:27017/agilearena?auto_reconnect');  

db.addEvent = function(aggregateId, e, callback){
	var query = { aggregateId : aggregateId};
	var params = {safe:true, serializeFunctions:true};
	var data = {'$push': { events : e}};
	this.collection('events').update(query, data, params, callback);
}; 

module.exports = db;