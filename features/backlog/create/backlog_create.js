var Backlogs = require('../../../domain/backlog');

//GET -> /backlog/create
exports.create_get = function(req, res){
  res.render('./backlog/create/backlog_create', { title : "Create backlog"});
};

//POST -> /backlog/create
exports.create_post = function(req, res){
  var b = new Backlogs();
  b.name = req.body.backlog.name;
  b.owner = req.user._id;
  b.save();

  res.redirect('/backlogs/' + b._id); 
};