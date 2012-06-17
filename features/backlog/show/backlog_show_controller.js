var db = require(NODE_APPDIR + '/db');
var Backlog = require(NODE_APPDIR + '/domain/backlog');


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
    var backlogItems = [];

    doc.items.forEach(function(i){      
      backlogItems.push({ description : i.description });
    });

    var model = {
      title : "Backlog - " + doc.name,
      backlog : doc,
      backlogItems : backlogItems
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

      for(var i = 0, length = backlogEventRoot.events.length; i < length; i++){
        backlogEventRoot.events[i].run(backlog);
        if(i >= req.params.version)
          break;
      }      

      var model = {
        title : "Backlog - " + backlog.name,
        backlog : backlog,        
        events : backlogEventRoot.events
      };
      res.render('./backlog/show/backlog_show', model);
  });
};