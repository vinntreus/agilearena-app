var Backlogs = require('../../../domain/backlog');

//GET -> /backlogs/:id
exports.show = function(req, res){
  Backlogs.findById(req.params.id, function(err, doc){
    var backlogItems = [];

    doc.items.forEach(function(i){      
      backlogItems.push({ description : i.description });
    });

    var model = {
      title : "Backlog - " + doc.name,
      backlog : doc,
      backlogItems : backlogItems
    };
    res.render('./backlog/show/backlog_show', model);
  }); 
};