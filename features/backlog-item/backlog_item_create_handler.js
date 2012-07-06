var db = require(NODE_APPDIR + '/db');

var createBacklogItemHandler = (function() {

/* @options :object
/*      backlog_id : string
/*      backlog_item : object[backlog_item]
/*      created_by : object[user]
/* @callback :function (error, backlog_item_id) */
  var createBacklogItem = function(options, callback) {    
    var backlogItem = {
      description : options.backlog_item.description,
      createdById : options.created_by._id
    };    

    db.getBacklog(options.backlog_id, function(backlog){
      backlog.addItem(backlogItem, function(error){
        if(error != null) {
          return callback(error);
        }        
        var create_backlogitem_event = buildEvent(backlogItem);
        var eventData = { event : create_backlogitem_event, created_by : options.created_by };
        storeEvent(options.backlog_id, eventData, callback);
      });
    });
  };

  var buildEvent = function(backlog_item) {
    return {
      type : "CreatedBacklogItemEvent",
      data : backlog_item,
      run : function(backlog){
        backlog.items.push(this.data);
      }
    };
  };

  var storeEvent = function(backlogId, eventData, callback) {    
    db.addEvent(backlogId, eventData, function(error, data) {
      if(error != null) {
        console.log("addEvent::create_backlogitem_event::Error::", error);
        return callback("Could not store backlogitem");
      }      
      
      updateReadModel(backlogId, data, callback);
    });
  };

  var updateReadModel = function(backlog_id, backlog_item_data, callback) {
    db.addBacklogItem(backlog_id, backlog_item_data, function(error) {
      var errorMessage;

      if(error != null) {
        console.log("createBacklogItemHandler::updateReadModel::addBacklogItem::Error::", error);
        errorMessage = "Could not save backlogitem";
      } 
      
      callback(errorMessage, backlog_item_data._id);
    });
  };

  return {
    createBacklogItem : createBacklogItem
  };

}());

module.exports = createBacklogItemHandler;