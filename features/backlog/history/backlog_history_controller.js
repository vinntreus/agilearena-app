var db = require(NODE_APPDIR + '/db');
var Backlog = require(NODE_APPDIR + '/domain/backlog');

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;  
  app.get('/backlogs/:id/:version', auth.ensureAuthenticated, history);
};

//ACTIONS
var history = function(req, res){
  var backlogId = req.params.id;
  var version = req.params.version;
  var user = req.user;

  db.getAggregateVersion(backlogId, Backlog, version, function(backlog, events){
    var model = {
      title : "Backlog - " + backlog.name,
      backlog : backlog,        
      events : events,
      currentVersion : version,
      user : user,
    };
    res.render('./backlog/show/backlog_history', model);
  });

};