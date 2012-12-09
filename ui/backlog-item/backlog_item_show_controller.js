var db = require(NODE_APPDIR + '/db');
var format = require('dateformat');

var show = function(req, res){
  db.backlogs.findById(req.params.backlogId, function(err, doc){
    var item;
    for(var i = 0; i < doc.items.length; i++){
      if(doc.items[i]._id.toString() === req.params.itemId.toString()){
        item = doc.items[i];        
      }
    }
    
    var model = {
      title : "Backlog - " + doc.name,
      backlogId : req.params.backlogId,
      item : item,
      created : format(item.created, "yyyy-mm-dd HH:MM:ss")
    };

    res.render('./backlog-item/backlog_item_show', model);
  });
};

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;

  app.get('/backlogs/:backlogId/item/:itemId', auth.ensureAuthenticated, show);
};