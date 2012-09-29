var backlogReadstore = require(NODE_APPDIR + '/backlog_readstore'),
    Backlog = require(NODE_APPDIR + '/domain/backlog'),
    eh = require(NODE_APPDIR + '/event_handler');

var addedLabelEvent = function(label){
  return {
    type : "AddedBacklogLabelEvent",
    data : label,
    run : function(backlog){
      backlog.labels.push(this.data);
    }
  };
};

var addLabel = function(options, callback){
  var e = addedLabelEvent(options.label);
  var o = {
    arId : options.backlogId,
    arType : Backlog,
    events : [e],
    createdBy : options.createdBy,
    runCommand : function(root) {
      return root.addLabel(e.data);
    },
    onUpdateReadModel : backlogReadstore.addLabel
  };
  eh.process(o, callback);
};

module.exports = { addLabel : addLabel };