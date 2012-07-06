var BacklogModel = require(NODE_APPDIR + '/domain/backlog');
var db = require(NODE_APPDIR + '/db');
var es = require(NODE_APPDIR + '/event_store');


var createBacklogHandler = function(command, options){
  db.backlogs.count({ name : command.name, owner : command.owner }, function(err, doc){
    if(doc === 0){ //no backlogs with same name      
      createBacklog(command, options);
    } else {
      options.failure('Already have backlog with same name');  
    }    
  });
};

var createBacklog = function(command, options){
  var backlogAggregate = {    
    type : "Backlog",        
  };
  var backlogCreatedEvent = {    
    type : "CreatedBacklog",    
    data : {name : command.name, owner : command.owner._id, createdBy : command.owner.username},
    run : function(obj){
      return new obj(this.data);
    }
  };
  es.createAggregateRoot(backlogAggregate, backlogCreatedEvent, command.owner, function(aggregate){
    var backlog = aggregate.events[0].run(BacklogModel);    
    db.backlogs.insert(backlog, function(err, docs){
      if(err != null) {
        console.log("ERROR [create_backlog_handler::createBacklog] => Could not store backlog", eventErr);
        return options.failure("Could not save backlog");
      }
      options.success(backlog._id);
    });
  });  
};

module.exports.create = createBacklogHandler;