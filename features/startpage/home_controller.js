var Backlogs = require('../../domain/backlog');

var home_controller = {
  index : function(req, res){    
    Backlogs.find({owner : req.user._id}, function(err, doc){
      
      var viewModel = {
        title : "Home",
        user : req.user,
        backlogs : doc,
        backlog_count : doc.length
      };

      res.render('./startpage/home', viewModel);
    });    
  }
};

exports.index = home_controller.index;