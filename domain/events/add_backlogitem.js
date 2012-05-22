module.exports = exports = function addBacklogItem (schema) {
  
  schema.methods.run = function(backlog){
    backlog.items.push(this.data);
  }; 

}