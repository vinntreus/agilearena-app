function Backlog (options){
  this._id = options._id;
  this.name = options.name;
  this.owner = options.owner;
  this.created = options.created;
  this.items = options.items || [];
  this.labels = options.labels || [];
}

Backlog.prototype.addLabelToItem = function(id, label){
	var item;
	for(var i = 0, l = this.items.length; i < l; i++){
		if(this.items[i]._id.toString() === id.toString()){
			item = this.items[i];
			break;
		}
	}
	if(!item){
		return "Item does not exist";
	}
	item.labels = item.labels || [];
	for(var j = 0, k = item.labels.length; j < k; j++){
		if(item.labels[j] === label){
			return "Item already has that label";
		}
	}
	item.labels.push(label);
};

Backlog.prototype.addLabel = function(label){
	var validationResult = this.validateAddLabel(label);
	if(validationResult == null){
		this.labels.push(label);				
	}
	return validationResult;
};

Backlog.prototype.validateAddLabel = function(label){
	if(this.labels.indexOf(label) > -1)	{
		return "Label already exist";
	}
	return null;
};

Backlog.prototype.addItem = function(item){
	if(item == null || item.description == null || item.description.trim() === ""){
		return "Cannot add empty item";
	}
	
	this.items.push(item);	
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