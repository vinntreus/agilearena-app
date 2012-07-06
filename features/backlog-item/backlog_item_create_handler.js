var db = require(NODE_APPDIR + '/db');

var createBacklogItemHandler = (function() {

/* @callback :function (error, backlogItemId) */
  var createBacklogItem = function(options, callback) {    
    var backlogId = options.backlogId;
    var createdBy = options.createdBy;
    var backlogItem = {
      description : options.backlogItem.description,
      createdById : createdBy._id
    };    

    db.getBacklog(backlogId, function(backlog){
      backlog.addItem(backlogItem, function(error){
        if(error != null) {
          return callback(error);
        }        
        var createBacklogItemEvent = buildEvent(backlogItem);
        var eventData = { event : createBacklogItemEvent, createdBy : createdBy };
        storeEvent(backlogId, eventData, callback);
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

  var storeEvent = function(backlogId, eventData, callback) {    
    db.addEvent(backlogId, eventData, function(error, data) {
      if(error != null) {
        console.log("createBacklogItem::storeEvent::Error::", error);
        return callback("Could not store backlogitem");
      }      
      updateReadModel(backlogId, data, callback);
    });
  };

  var updateReadModel = function(backlogId, backlogItemData, callback) {
    db.addBacklogItem(backlogId, backlogItemData, function(error) {
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