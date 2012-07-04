var db = require(NODE_APPDIR + '/db');

var createBacklogItemHandler = (function() {
  //callback params = (error, backlog_item_id)
  var createBacklogItem = function(backlog_id, backlog_item, callback) {
    var create_backlogitem_event = buildEvent(backlog_item);
    storeEvent(backlog_id, create_backlogitem_event, callback);
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

  var storeEvent = function(backlog_id, create_backlogitem_event, callback) {
    db.addEvent(backlog_id, create_backlogitem_event, function(error) {
      if(error != null) {
        console.log("addEvent::create_backlogitem_event::Error::", error);
        callback("Could not save item");
      }
      else {
        var backlog_item_data = create_backlogitem_event.data;
        updateReadModel(backlog_id, backlog_item_data, callback);
      }
    });
  };

  var updateReadModel = function(backlog_id, backlog_item_data, callback) {
    db.addBacklogItem(backlog_id, backlog_item_data, function(error) {
      if(error != null) {
        console.log("createBacklogItemHandler::updateReadModel::addBacklogItem::Error::", error);
        callback("Could not save item");
      } 
      else {
        callback(null, backlog_item_data._id);
      }
    });
  };

  return {
    createBacklogItem : createBacklogItem
  };

}());

module.exports = createBacklogItemHandler;