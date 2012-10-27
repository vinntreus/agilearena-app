var handler = require(NODE_APPDIR + '/commands/backlogitem_labels');

//ACTIONS
var addLabel = function(req, res){  
  var options = {
    backlogId : req.body.backlog_id,
    item_ids : req.body.items,
    labels : req.body.labels,
    createdBy : req.user
  };
  handler.addLabel(options, function(error, itemId){
    if(error != null){
      res.send(error, 500);
    }
    else {      
      res.send({}, 200);
    }
  });  
};

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;
  app.post('/backlog-item/label', auth.ensureAuthenticated, addLabel);
};