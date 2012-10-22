var aa = aa || {};

aa.backlogitems = (function(){
  var _container;

  var toggleToolbar = function(){
    var showToolbar = $(".selected", _container).length > 0;
    var toolbar = $(".toolbar-container");
    if(showToolbar){
      toolbar.show();
    }
    else{
      toolbar.hide();
    }
  }

  var initSelectedEvents = function(){
    
    _container.on("click", function(e){
      var target = $(e.target);      
      if(target.is("input[type='checkbox']")){        
        target.parents("tr").toggleClass("selected");
        toggleToolbar();
      }
    });
  };

  var setSortOrder = function(){
    var sortorder = 1;
    var items = $("td.sortorder", _container);
    _.each(items, function(i){
      $(i).text(sortorder++);
    });    
  }

  return {
    init : function(){
      _container = $(".backlog-items");
      initSelectedEvents();

    },
    setSortOrder : setSortOrder
  };
}());