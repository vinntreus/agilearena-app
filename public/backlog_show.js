var Backlog = function(items){
  this.items = ko.observableArray(items);
  this.itemToAdd = ko.observable("");

  this.addItem = function() {
    var self = this;
    var item;

    if (this.itemToAdd() != "") {      
      item = new BacklogItem({ description : this.itemToAdd() });
      this.createItem(item, function(){
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

  this.addItemForm = $("#add_backlogitem");
  this.addItemUrl = this.addItemForm.attr("action");  
  this.getAddItemData = function(){
    return this.addItemForm.serialize();
  };

  this.createItem = function(item, onSuccess){
    this.items.push(item); 
    var data = this.getAddItemData();
    $.post(this.addItemUrl, data, onSuccess);
  };
};

var BacklogItem = function(options){
  this.description = options.description;
  this.isSelected = ko.observable(false);    
};

var BacklogView = function(backlogItems){
  this.items = [];
  this.backlogItems = backlogItems || [];  
};

BacklogView.prototype = {
  init : function(){
    var that = this;
    $(function(){    
      for(var i = 0, length = that.backlogItems.length; i < length; i++){
        that.items[i] = new BacklogItem(that.backlogItems[i]);
      }  
      ko.applyBindings(new Backlog(that.items));  
    }); 
  }
}