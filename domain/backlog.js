var mongoose = require('mongoose');
var Schema = mongoose.Schema

var BacklogItemSchema = new mongoose.Schema({
  description : String,
  created : { type : Date, default : Date.now }
});

var BacklogSchema = new mongoose.Schema({
  name : String,
  owner : Schema.ObjectId,
  created : { type : Date, default : Date.now },
  items : [BacklogItemSchema]
});
var Backlogs = mongoose.model('Backlog', BacklogSchema);

module.exports = Backlogs;