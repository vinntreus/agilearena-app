var db = require(NODE_APPDIR + '/db');

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;
  app.post('/backlog-item/create', auth.ensureAuthenticated, create_backlogitem);   
};

//ACTIONS
var create_backlogitem = function(req, res){
  var backlog_item = req.body.backlog_item;  
  var backlog_id = db.toObjectID(req.body.backlog_id);

  backlog_item._id = new db.ObjectID();
  backlog_item.createdBy = req.user.username;
  backlog_item.createdById = req.user._id;

  db.updateBacklog(backlog_id, {$push: {items:backlog_item}}, function(err, backlog){
    if(err == null){
      var createBacklogitemEvent = {        
        type : "CreatedBacklogItemEvent",        
        data : backlog_item,
        run : function(backlog){
          backlog.items.push(this.data);
        }     
      };
      db.addEvent(backlog_id, createBacklogitemEvent, function(err, ev){
        res.send({ "_id" : backlog_item._id }, 200);
      });
    }
    else{
      res.send('Could not create item', 500);
    }
  }); 
};