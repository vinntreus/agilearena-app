var db = require(NODE_APPDIR + '/db');


//ROUTES
exports.route = function(options){
  options.app.get('/', options.auth.ensureAuthenticated, index);
};

//ACTIONS
var index = function(req, res){

  console.log(req.user);

  db.collection('backlogs').find({owner : req.user._id}).toArray(function(err, docs){
    //console.log("backlogs found: ", docs);
    var viewModel = {
      title : "Home",
      user : req.user,
      backlogs : docs || [],
      backlog_count : docs.length
    };
    res.render('./startpage/home', viewModel);  
  });  
};