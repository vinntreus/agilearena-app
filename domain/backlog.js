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
	if(item.createdById.toString() !== this.owner.toString()){
		return "Not allowed to add item";
	}
	return null;
};

Backlog.prototype.deleteItem = function(id){
	var foundItemAtIndex = -1;			
	
	this.items.every(function(item, index){				
		if(item._id.toString() === id.toString()) {
			foundItemAtIndex = index;
			return false;
		}
		return true;
	});

	if(foundItemAtIndex > -1){
		this.items.splice(foundItemAtIndex, 1);
		return true;
	}			
	return false;
};

module.exports = Backlog;