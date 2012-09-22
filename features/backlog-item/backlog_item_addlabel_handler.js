var backlogReadstore = require(NODE_APPDIR + '/backlog_readstore'),
    Backlog = require(NODE_APPDIR + '/domain/backlog'),
    eh = require(NODE_APPDIR + '/event_handler');

var addLabelEvent = function(data){
  return {
    type : "AddBacklogItemLabelEvent",
    data : data,
    run : function(backlog){
      var id = this.data.id;
      var label = this.data.label;
      backlog.items.forEach(function(item){
        if(item._id.toString() === id.toString()){
          item.labels = item.labels || [];
          item.labels.push(label);
          return false;
        }
      });
    }
  };
};

var addLabel = function(options, callback){
  var e = addLabelEvent({ label: options.label, id : options.backlogItemId });
  var o = {
    arId : options.backlogId,
    arType : Backlog,
    events : [e],
    createdBy : options.createdBy,
    runCommand : function(root) {
      return root.addLabelToItem(e.data.id, e.data.label);
    },
    onUpdateReadModel : backlogReadstore.addLabelToBacklogItem,
    loggingEnabled : true
  };
  eh.process(o, callback);
};

module.exports = { addLabel : addLabel };