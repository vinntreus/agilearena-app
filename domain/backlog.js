function Backlog (options){
  this._id = options._id;
  this.name = options.name;
  this.owner = options.owner;
  this.created = options.created;
  this.items = options.items || [];
};

Backlog.prototype.addItem = function(item, callback){
	var validationResult = this.validateAddItem(item);
	
	if(validationResult == null)
		this.items.push(item);

	callback(validationResult);
};

Backlog.prototype.validateAddItem = function(item){
	if(item == null || item.description == null || item.description.trim() == ""){
		return "Cannot add empty item";
	}
	if(item.createdById !== this.owner){
		return "Not allowed to add item";
	}
	return null;
};

module.exports = Backlog;