
if(typeof backlogItems != 'undefined'){

  var Backlog = function(items){
    this.items = ko.observableArray(items);
    this.itemToAdd = ko.observable("");

    this.addItem = function() {
      var form = $("#add_backlogitem");
      var data = form.serialize();
      var url = form.attr("action");
      var self = this;

      if (this.itemToAdd() != "") {
          this.items.push(new BacklogItem({ description : this.itemToAdd() })); 
          $.post(url, data, function(d){
            self.itemToAdd("");
          });
      }
      
      return false;
    }.bind(this);     

     this.selectedItems = ko.computed(function() {
        return ko.utils.arrayFilter(this.items(), function(item) {
            return item.isSelected();
        });
    }, this);
    
  };
  
  var BacklogItem = function(options){
    this.description = options.description;
    this.isSelected = ko.observable(false);    
  };

	var items = [];
	for(var i = 0, length = backlogItems.length; i < length; i++){
	  items[i] = new BacklogItem(backlogItems[i]);
	}
	ko.applyBindings(new Backlog(items));  
}