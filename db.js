var mongo = require('mongoskin'),	
  	db = mongo.db('localhost:27017/agilearena?auto_reconnect', {safe : false});

db.events = db.collection('events');
db.backlogs = db.collection('backlogs'); 
db.BSON = mongo.BSON;

db.setId = function(item){
	item._id = new db.ObjectID();
};
db.setCreated = function(item, createdBy){
	item.created = new Date();
	item.createdBy = createdBy.username;
	item.createdById = db.toObjectID(createdBy._id);	
	return item;
};

module.exports = db;