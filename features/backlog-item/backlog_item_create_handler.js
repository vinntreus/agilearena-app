var db = require(NODE_APPDIR + '/db');

var createBacklogItemHandler = (function() {
  //callback params = (error, backlog_item_id)
  var createBacklogItem = function(options, callback) {
    var create_backlogitem_event = buildEvent(options.backlog_item);
    storeEvent(create_backlogitem_event, options, callback);
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

  var storeEvent = function(create_backlogitem_event, options, callback) {
    var eventData = { event : create_backlogitem_event, created_by : options.created_by };
    db.addEvent(options.backlog_id, eventData, function(error) {
      if(error != null) {
        console.log("addEvent::create_backlogitem_event::Error::", error);
        callback("Could not save item");
      }
      else {
        var backlog_item_data = create_backlogitem_event.data;
        updateReadModel(options.backlog_id, backlog_item_data, callback);
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