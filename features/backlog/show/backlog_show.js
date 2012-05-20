var Backlogs = require('../../../domain/backlog');

//GET -> /backlogs/:id
exports.show = function(req, res){
  Backlogs.findById(req.params.id, function(err, doc){
    var model = {
      title : "Backlog - " + doc.name,
      backlog : doc
    };
    res.render('./backlog/show/backlog_show', model);
  }); 
};