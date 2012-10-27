var aa = aa || {};

aa.backlogitems = (function(){
  var _container,
      _toolbar;

  var _initSelectItems = function(){    
    _container.on("click", "input[type='checkbox']", function(e){
      $(this).parents("tr").toggleClass("selected");
      toggleToolbar();      
    });
  };

  var toggleToolbar = function(){
    var showToolbar = $(".selected", _container).length > 0;    
    showToolbar ? _toolbar.show() : _toolbar.hide();    
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
      _toolbar = $(".toolbar-container");
      _initSelectItems();
    },
    setSortOrder : setSortOrder,
    toggleToolbar : toggleToolbar
  };
}());