var mongoose = require('mongoose');
var Schema = mongoose.Schema

var BaseEventSchema = new mongoose.Schema({
  created : { type : Date, default : Date.now },
  data : {}
});

var EventsSchema = new mongoose.Schema({
  aggregateId : Schema.ObjectId,  
  events : [BaseEventSchema]
});
var Events = mongoose.model('Events', EventsSchema);

exports.Events = Events;
exports.EventBase = BaseEventSchema;

/*

example of how the structure would look like:

var backlog = {
  id : "1"
}
var events = {
  aggregateId : "1",
  events : [{ created: "2010-01-01", data : { name : "first-backlog-item" }, type : "add_backlogitem"}]  
};

*/