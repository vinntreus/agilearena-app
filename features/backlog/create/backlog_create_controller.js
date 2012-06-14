var backlogCreator = require('./backlog_create');

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;

  app.post('/backlog/create', auth.ensureAuthenticated, create_post); 
  app.get('/backlog/create', auth.ensureAuthenticated, create_get);
};

//ACTIONS
var create_get = function(req, res){
  res.render('./backlog/create/backlog_create', { title : "Create backlog"});
};

var create_post = function(req, res){ 

  var backlogData = {    
    name : req.body.backlog.name,
    owner : req.user._id
  }; 

  backlogCreator.create(backlogData, {
    success : function(backlogId){
      res.redirect('/backlogs/' + backlogId);
    },
    failure : function(error){
      res.render('./backlog/create/backlog_create', { title : "Create backlog", error : err});
    }
  });   
};