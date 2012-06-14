function Backlog (options){
  this._id = options._id;
  this.name = options.name;
  this.owner = options.owner;
  this.created = options.created;
  this.items = options.items || [];
};

Backlog.prototype.addItem = function(item){
  this.items.push(item);
};

module.exports = Backlog;