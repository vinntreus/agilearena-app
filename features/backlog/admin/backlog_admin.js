var Backlogs = require('../../../domain/backlog');

//GET -> /backlogs/:id/admin
exports.admin = function(req, res){
  Backlogs.findById(req.params.id, function(err, doc){
    var model = {
      title : "Admin - " + doc.name,
      backlog : doc
    };
    res.render('./backlog/admin/backlog_admin', model);
  }); 
};
