var aa = aa || {}; 

aa.removeBacklogItem = (function(){
  
  var getItems = function(){
    return $(".backlog-items .selected");
  }
  var removeItems = function(){
    var selection = getItems();
    var itemIds = _.map(selection, function(s){
      return $(s).data("id");
    });
    
    var backlogId = $("#backlog_id").val();
    var data = {backlog_id : backlogId, items : itemIds};
    
    $.post('/backlog-item/delete', data, function(d){
      onRemovedItems(selection);  
    }).error(function(r){
      alert(r.responseText);
    });
  };

  var onRemovedItems = function(selection){
    _.each(selection, function(item){
      $(item).remove();
    });
    aa.backlogitems.setSortOrder();
  };

  var initEvents = function(){    
    $("#remove_backlogitem").off();
    $("#remove_backlogitem").on("click", function(){      
      removeItems();
    });
  };
  return {
    init : function(){
      initEvents();      
    }
  }
}());