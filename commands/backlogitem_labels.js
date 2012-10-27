var backlogReadstore = require(NODE_APPDIR + '/backlog_readstore'),
    Backlog = require(NODE_APPDIR + '/domain/backlog'),
    eh = require(NODE_APPDIR + '/event_handler');

var addedLabelEvent = function(data){
  return {
    type : "AddedBacklogItemLabelEvent",
    data : data,
    run : function(backlog){
      var ids = this.data.item_ids;
      var labels = this.data.labels;
      ids.forEach(function(id){
        backlog.items.forEach(function(item){
          if(item._id.toString() === id.toString()){
            item.labels = labels;
            return false;
          }
        });
      });      
    }
  };
};

var addLabel = function(options, callback){  
  var e = addedLabelEvent({ labels: options.labels, item_ids : options.item_ids });
  var o = {
    arId : options.backlogId,
    arType : Backlog,
    events : [e],
    createdBy : options.createdBy,
    runCommand : function(root) {      
      return root.addLabelToItem(e.data.item_ids, e.data.labels);
    },
    onUpdateReadModel : backlogReadstore.addLabelToBacklogItem,
    loggingEnabled : true
  };
  eh.process(o, callback);
};

module.exports = { addLabel : addLabel };