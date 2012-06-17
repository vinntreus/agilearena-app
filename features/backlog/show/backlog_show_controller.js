var db = require(NODE_APPDIR + '/db');
var Backlog = require(NODE_APPDIR + '/domain/backlog');
var format = require('dateformat');
var types = { CreatedBacklog : "Created backlog", CreatedBacklogItemEvent : "Added item"};


//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;
  app.get('/backlogs/:id', auth.ensureAuthenticated, show);
  app.get('/backlogs/:id/:version', auth.ensureAuthenticated, version);
}

//ACTIONS
var show = function(req, res){
  db.collection('backlogs').findById(req.params.id, function(err, doc){
    var model = {
      title : "Backlog - " + doc.name,
      backlog : doc,
      user : req.user,
    };
    res.render('./backlog/show/backlog_show', model);    
  }); 
};

//GET -> /backlogs/:id/:version
var version = function(req, res){
  var backlogId = db.toObjectID(req.params.id);
  db.collection('events').findOne({ aggregateId : backlogId } , {raw:true}, function(err, backlogEvents){
      var backlogEventRoot = db.bson_serializer.BSON.deserialize(backlogEvents, {evalFunctions:true, cacheFunctions:true});            
      var backlog = backlogEventRoot.getAggregate(Backlog);
      var events = [];
      var e;

      for(var i = 0, length = backlogEventRoot.events.length; i < length; i++){        
        e = backlogEventRoot.events[i];
        if(i <= req.params.version){
          e.run(backlog);
        }        
        events.push({ type : types[e.type], 
                      created : format(e.created, "yyyy-dd-mm HH:MM:ss"),
                      createdBy : e.data.createdBy || ""
                    });
      }      

      var model = {
        title : "Backlog - " + backlog.name,
        backlog : backlog,        
        events : events,
        currentVersion : req.params.version,
        user : req.user,
      };
      res.render('./backlog/show/backlog_version', model);
  });
};