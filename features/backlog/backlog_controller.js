var Backlogs = require('../../domain/backlog')

//GET -> /backlogs/:id
exports.show = function(req, res){
	Backlogs.findById(req.params.id, function(err, doc){
		var model = {
		  title : "Backlog - " + doc.name,
		  backlog : doc
		};
		res.render('./backlog/backlog_show', model);
	});	
};

//GET -> /backlog/create
exports.create_get = function(req, res){
	res.render('./backlog/backlog_create', { title : "Create backlog"});
};

//POST -> /backlog/create
exports.create_post = function(req, res){
	var b = new Backlogs();
	b.name = req.body.backlog.name;
	b.owner = req.user._id;
	b.save();

	res.redirect('/backlogs/' + b._id);	
};