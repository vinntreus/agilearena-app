var Backlogs = require('../../../domain/backlog');


//DELETE -> /backlogs/:id
exports.delete = function(req, res){
  Backlogs.remove({ _id : req.params.id, owner : req.user._id}, function(err, doc){   
    res.render('./backlog/delete/backlog_deleted', {title : "Deleted backlog"});
  }); 
};