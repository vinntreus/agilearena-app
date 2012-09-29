var backlogReadstore = require(NODE_APPDIR + '/backlog_readstore'),
    Backlog = require(NODE_APPDIR + '/domain/backlog'),
    db = require(NODE_APPDIR + '/db.js'),
    eh = require(NODE_APPDIR + '/event_handler');

var createdBacklogItemEvent = function(backlogItem) {
  return {
    type : "CreatedBacklogItemEvent",
    data : backlogItem,
    run : function(backlog){
      backlog.items.push(this.data);
    }
  };
};

var createBacklogItem = function(options, callback) {    
  var createdBy = options.createdBy;
  var backlogItem = options.backlogItem;
            
  db.setId(backlogItem);
  db.setCreated(backlogItem, createdBy);
  var e = createdBacklogItemEvent(backlogItem);

  var o = {
    arId : options.backlogId,
    arType : Backlog,
    events : [e],
    createdBy : createdBy,
    runCommand : function(root) {
      return root.addItem(e.data);
    },
    onUpdateReadModel : backlogReadstore.addBacklogItem
  };
  eh.process(o, callback); 
};

module.exports = { createBacklogItem : createBacklogItem };