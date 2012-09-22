var es = require(NODE_APPDIR + '/event_store');

var onUpdateReadModel = function(arId, data, callback){};
var loggingEnabled = false;
var log = function(textToLog, itemToLog){
  if(loggingEnabled){    
    console.log(arguments[0], itemToLog || {});
  }
};

/** options
      arId : (id of aggregateRoot),
      arType : (objekt to play ar events on)
      createdBy : (user object)
      events : (array of events)
      runCommand : function(root){},
      onUpdateReadModel : function(arId, data, callback)
    callback : function(errormessage, data from event) */
var processEvent = function(options, callback){
  loggingEnabled = options.loggingEnabled || false;
  onUpdateReadModel = options.onUpdateReadModel;
  es.getAggregateRoot(options.arId, options.arType, null, function(ar, events){
    log("found aggregate root");
    var result = options.runCommand(ar);
    if(result != null){ 
      callback (result);
    }
    else {
      storeEvent(options.arId, options.events, options.createdBy, callback);
    }
  });
};

var storeEvent = function(arId, events, createdBy, callback) {
  es.addEvents(arId, events, createdBy, function(error, events) {
    if(error != null) {
      log("storeEvent::Error::", error);
      return callback("Could not store event(s)");
    }      
    log("stored event(s)");
    events.forEach(function(e){
      updateReadModel(arId, e.data, callback);
    });    
  });
};

var updateReadModel = function(arId, data, callback) {
  log("onUpdateReadModel", onUpdateReadModel);
  onUpdateReadModel(arId, data, function(error){
    var errorMessage;
    if(error != null) {
      log("updateReadModel::Error::", error);
      errorMessage = error;
    }      
    log("updated readmodel");
    
    callback(errorMessage, data);
  });  
};

module.exports = { process : processEvent };