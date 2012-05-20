module.exports = exports = function addBacklogItem (schema, backlogItem) {
  schema.add({ data: backlogItem });
  schema.methods.run = function(backlog){
    backlog.items.push(this.data);
  }; 
}