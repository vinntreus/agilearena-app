var backlogCreator = require(NODE_APPDIR + '/commands/backlog_create');

//ACTIONS
var create_get = function(req, res){
  res.render('./backlog/backlog_create', 
    { title : "Create backlog", 
      user : req.user}
  );
};

var create_post = function(req, res){ 
  var backlogData = {    
    name : req.body.backlog.name,
    owner : req.user
  }; 

  backlogCreator.create(backlogData, {
    success : function(backlogId){
      res.redirect('/backlogs/' + backlogId);
    },
    failure : function(error){
      res.render('./backlog/backlog_create', 
        { title : "Create backlog", 
          error : error, 
          user : req.user }
      );
    }
  });   
};

//ROUTES
exports.route = function(options){
  var app = options.app;
  var auth = options.auth;

  app.post('/backlog/create', auth.ensureAuthenticated, create_post); 
  app.get('/backlog/create', auth.ensureAuthenticated, create_get);
};
