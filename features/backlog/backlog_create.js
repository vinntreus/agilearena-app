var BacklogModel = require(NODE_APPDIR + '/domain/backlog');
var db = require(NODE_APPDIR + '/db');
var es = require(NODE_APPDIR + '/event_store');

var createBacklog = function(command, options){
  var backlogAggregate = {    
    type : "Backlog"     
  };
  var backlogCreatedEvent = {    
    type : "CreatedBacklog",    
    data : { 
      name : command.name, 
      owner : command.owner._id, 
      createdBy : command.owner.username
    },
    run : function(Obj){
      return new Obj(this.data);
    }
  };
  es.createAggregateRoot(backlogAggregate, backlogCreatedEvent, command.owner, 
    function(aggregate) {
      var backlog = aggregate.events[0].run(BacklogModel);    
      db.backlogs.insert(backlog, function(err, docs){
        if(err != null) {
          console.log("ERROR [create_backlog_handler::createBacklog] => Could not store backlog", err);
          return options.failure("Could not save backlog");
        }
        options.success(backlog._id);
      });
  });  
};

var createBacklogHandler = function(command, options){
  db.backlogs.count({ name : command.name, owner : command.owner }, 
    function(err, doc) {
      if(doc === 0){ //no backlogs with same name      
        createBacklog(command, options);
      } else {
        options.failure('Already have backlog with same name');  
      }    
  });
};


module.exports.create = createBacklogHandler;