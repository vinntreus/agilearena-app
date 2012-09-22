var db = require(NODE_APPDIR + '/db'),
    backlogReadstore = require(NODE_APPDIR + '/backlog_readstore'),
    es = require(NODE_APPDIR + '/event_store'),
    Backlog = require(NODE_APPDIR + '/domain/backlog');

var createBacklogItemHandler = (function() {

/* @callback :function (error, backlogItemId) */
  var createBacklogItem = function(options, callback) {    
    var backlogId = options.backlogId;
    var createdBy = options.createdBy;
    var backlogItem = options.backlogItem;
              
    db.setId(backlogItem);
    db.setCreated(backlogItem, createdBy);

    es.getAggregateRoot(backlogId, Backlog, null, function(backlog, events){    
      backlog.addItem(backlogItem, function(error){
        if(error != null) {
          return callback(error);
        }        
        var createBacklogItemEvent = buildEvent(backlogItem);        
        storeEvent(backlogId, createBacklogItemEvent, createdBy, callback);
      });
    });
  };

  var buildEvent = function(backlogItem) {
    return {
      type : "CreatedBacklogItemEvent",
      data : backlogItem,
      run : function(backlog){
        backlog.items.push(this.data);
      }
    };
  };

  var storeEvent = function(backlogId, createEvent, createdBy, callback) {
    es.addEvents(backlogId, [createEvent], createdBy, function(error, events) {
      if(error != null) {
        console.log("createBacklogItem::storeEvent::Error::", error);
        return callback("Could not store backlogitem");
      }      
      updateReadModel(backlogId, events[0].data, callback);
    });
  };

  var updateReadModel = function(backlogId, backlogItemData, callback) {
    backlogReadstore.addBacklogItem(backlogId, backlogItemData, function(error) {
      var errorMessage;
      if(error != null) {
        console.log("createBacklogItem::updateReadModel::Error::", error);
        errorMessage = "Could not save backlogitem";
      }      
      callback(errorMessage, backlogItemData._id);
    });
  };

  return {
    createBacklogItem : createBacklogItem
  };

}());

module.exports = createBacklogItemHandler;