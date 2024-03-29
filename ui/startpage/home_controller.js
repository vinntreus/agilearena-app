var db = require(NODE_APPDIR + '/db');

//ACTIONS
var index = function(req, res){
  db.backlogs.find({owner : req.user._id}).toArray(function(err, docs){
    var b = docs || [];
    var viewModel = {
      title : "Home",
      user : req.user,
      backlogs : b,
      backlog_count : b.length
    };
    res.render('./startpage/home', viewModel);  
  });  
};

//ROUTES
exports.route = function(options){
  options.app.get('/', options.auth.ensureAuthenticated, index);
};