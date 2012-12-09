var db = require(NODE_APPDIR + '/db');

//ACTIONS
var show = function(req, res){
  db.backlogs.findById(req.params.id, function(err, doc){
    var model = {
      title : "Backlog - " + doc.name,
      backlog : doc,
      user : req.user,
      labels : doc.labels || []
    };
    res.render('./backlog/backlog_show', model);
  });
};

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;
  app.get('/backlogs/:id', auth.ensureAuthenticated, show);  
};