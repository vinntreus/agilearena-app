function BacklogItem (options){
  this.description = options.description;
  this.created = options.created;
  this.labels = options.labels || [];
}

module.exports = BacklogItem;