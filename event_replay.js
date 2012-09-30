var db = require('./db'),
    Backlog = require('./domain/backlog'),
    log;

var run = function(grunt, done){
  log = grunt.log;
  removeBacklogsFromReadStore(done, function(){
    replayBacklogEvents(done);
  });
};

var clear = function(grunt, done){
  log = grunt.log;
  log.writeln("starting to clear readstore");
  removeBacklogsFromReadStore(done, function(){
    removeBacklogEvents('Backlog', done);
  });
};

var removeBacklogsFromReadStore = function(done, callback){  
  db.backlogs.remove({}, {safe: true}, function(err, numberOfRemovedDocs){      
    if(err != null){
      log.writeln("Error when removing backlogs: " + err);
      done(false);
    }    
    else{
      log.writeln("Removed " + numberOfRemovedDocs + " backlogs...");
      callback();
    }
  });
};

var removeBacklogEvents = function(type, done){
  db.events.remove({type : type}, {safe: true}, function(err, numberOfRemovedDocs){      
    if(err != null){
      log.writeln("Error when removing aggregate: " + err);
      done(false);
    }    
    else{
      log.writeln("Removed " + numberOfRemovedDocs + " of aggregate: " + type + "...");
      done(true);
    }
  });
};

var replayBacklogEvents = function(done){
  db.events.findEach({ } , {raw:true}, function(err, rawAggregate){     
    if(err != null || rawAggregate == null){
      done();      
    }
    
    var aggregate = db.bson_serializer.BSON.deserialize(rawAggregate, {evalFunctions:true, cacheFunctions:true});
    var backlog = buildAggregateRoot(aggregate.events, Backlog);
    log.writeln("Found aggregate: " + backlog._id);
    db.backlogs.insert(backlog, function(err, docs){      
      log.writeln("Inserted backlog: " + backlog._id);
    });
  });
};

var buildAggregateRoot = function(events, domainObj){
  var mappedEvents = events.map(function(e, index){
    if(e.run){
      domainObj = e.run(domainObj) || domainObj;
    }      
  });
  return domainObj;
};

module.exports = {
  run: run,
  clear : clear
};