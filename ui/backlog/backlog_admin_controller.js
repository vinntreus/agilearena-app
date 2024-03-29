var db = require(NODE_APPDIR + '/db');

//ACTIONS
var admin = function(req, res){
  db.backlogs.findById(req.params.id, function(err, doc){
    var model = {
      title : "Admin - " + doc.name,
      backlog : doc,
      user : req.user
    };
    res.render('./backlog/backlog_admin', model);
  }); 
};


//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;

   app.get('/backlogs/:id/admin', auth.ensureAuthenticated, admin);
};

