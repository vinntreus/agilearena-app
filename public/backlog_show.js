var Backlog = function(items){
  this.items = ko.observableArray(items);
  this.itemToAdd = ko.observable("");

  this.addItem = function() {
    var self = this;    

    if (this.itemToAdd() != "") {      
      
      this.createItem(function(data){
        var item = new BacklogItem({ description : self.itemToAdd(), _id : data._id });
        self.items.push(item);
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

  this.createItem = function(onSuccess){     
    var data = this.getAddItemData();
    $.post(this.addItemUrl, data, onSuccess)
    .error(function(e){      
      alert(e.responseText);
    });
  };

  //note use of ES5 [map, forEach]
  this.removeItems = function(){
    var selection = this.selectedItems();
    var that = this;        
    var itemIds = selection.map(function(s){
      return s._id;
    });
    var backlogId = $("#backlog_id").val();
    var data = {backlog_id : backlogId, items : itemIds};    

    $.post('/backlog-item/delete', data, function(d){
      selection.forEach(function(s){
        that.items.remove(s);
      });
    }).error(function(r){
      alert(r.responseText);
    });

  }.bind(this);
};

var BacklogItem = function(options){
  this._id = options._id;
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