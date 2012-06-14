var BacklogModel = require(NODE_APPDIR + '/domain/backlog');
var db = require(NODE_APPDIR + '/db');


var createBacklogHandler = function(command, options){
  db.collection('backlogs').count({ name : command.name, owner : command.owner }, function(err, doc){
    if(doc === 0){ //no backlogs with same name
      storeBacklog(command, options);
    } else {
      options.failure('Already have backlog with same name');  
    }    
  });
};

var storeBacklog = function(command, options){
  var backlog = {
     _id   : command.id,
     name  : command.name,
     owner : command.owner,
     created : new Date(),
     items : []
  };

  db.collection('backlogs').insert(backlog, function(err, docs){
    storeCreatedBacklogEvent(docs[0], options);     
  });
};

var storeCreatedBacklogEvent = function(backlog, options){
   //assume user is just saved, now we create the event
  var backlogEvent = {
    aggregateId : backlog._id,
    type : "Backlog",
    created : backlog.created,
    data : backlog,
    events :[{
      _id : new db.ObjectID(),
      type : "CreatedBacklog",
      created : backlog.created,
      data : backlog,
      run : function(){}
    }],
    getAggregate : function(modelCtor){
      return new modelCtor(this.data);
    }          
  };
  //store the event (including its functions)
  db.collection('events').insert(backlogEvent, {safe:true, serializeFunctions:true}, function(eventErr, eventResult){
    db.close();
    
    if(eventErr != null){
      console.log("ERROR [craete_backlog_handler::storeCreatedBacklogEvent] => Could not store event", userErr);      
      return options.failure("Could not save event");
    }              
    options.success(backlog._id);
  });       
}

module.exports.create = createBacklogHandler;