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
    var showToolbar = _getSelected().length > 0;    
    showToolbar ? _toolbar.show() : _toolbar.hide();    
  };  

  var setSortOrder = function(){
    var sortorder = 1;
    var items = $("td.sortorder", _container);
    _.each(items, function(i){
      $(i).text(sortorder++);
    });    
  }

  var _getSelected = function(){
    return $(".selected", _container);
  }

  var getSelectedItemsId = function(){
    return _getSelected().map(function(){
      return $(this).data("id");
    }).get();    
  };

  var setLabels = function(labelData){
    var items = _getSelected();
    var labels = _.map(labelData, function(l){
      var el = $("<span class='label label-info'></span>");
      el.text(l);
      return el;
    });
    items.find(".label").remove();
    items.find(".item-description").after(labels);
  };

  var getLabels = function(){
    var items = _getSelected().find(".label");    
    var labels = {};
    _.each(items, function(l){
      labels[$(l).text()] = {};
    });
    return labels;
  };

  return {
    init : function(){
      _container = $(".backlog-items");
      _toolbar = $(".toolbar-container");
      _initSelectItems();
    },
    setSortOrder : setSortOrder,
    toggleToolbar : toggleToolbar,
    getSelectedItemsId : getSelectedItemsId,
    setLabels : setLabels,
    getLabels : getLabels,
    clearSelection : function(){
      $(".backlog-items .selected").removeClass("selected");
      $(".backlog-items input[type='checkbox']").prop("checked", false);
    }
  };
}());