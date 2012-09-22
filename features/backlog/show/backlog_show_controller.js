var db = require(NODE_APPDIR + '/db');
var Backlog = require(NODE_APPDIR + '/domain/backlog');

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;
  app.get('/backlogs/:id', auth.ensureAuthenticated, show);  
}

//ACTIONS
var show = function(req, res){
  db.backlogs.findById(req.params.id, function(err, doc){     
    var model = {
      title : "Backlog - " + doc.name,
      backlog : doc,
      user : req.user,
      labels : doc.labels || []
    };
    res.render('./backlog/show/backlog_show', model);    
  }); 
};