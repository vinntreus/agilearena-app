var Backlogs = require('../../domain/backlog');
var EventStore = require('../../domain/event');
var AddBacklogItemEvent = require('../../domain/events/add_backlogitem');



//POST -> /backlog-items/
exports.create = function(req, res){

  var backlog_item = req.body.backlog_item;
  var backlog_id = req.body.backlog_id;

  Backlogs.findById(backlog_id, function(err, backlog){
    EventStore.Events.findOne({ aggregateId : backlog._id}, function(err, ev){
      if(ev == null){
        var ev = new EventStore.Events();
        ev.aggregateId = backlog._id;  
      }
      
      EventStore.EventBase.plugin(AddBacklogItemEvent);

      backlog.items.push(backlog_item);
      ev.events.push({ data : backlog_item });
      backlog.save();
      ev.save();

      res.redirect('/backlogs/' + backlog_id); 
    });    
  }); 
  
};