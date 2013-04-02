var aa = aa || {};

aa.backlogitems = (function(){
  var _container,
      _toolbar;

  var _initSelectItems = function(){    
    _container.on("click", "input[type='checkbox']", function(e){
      $(this).parents("tr").toggleClass("selected");
      toggleToolbar();      
    });

    window.onhashchange = function () {
        navigateToItem(window.location.hash);
    };

    _container.on("click", "a", function(e){
      e.preventDefault();

      window.location.hash = $(this).attr("id");
    });

    if(window.location.hash){
      navigateToItem(window.location.hash);
    }
  };

  var setActiveItem = function(item){
    $(".backlog-items .active").removeClass("active");
    item.parents("tr").addClass("active");
  };

  var navigateToItem = function(id){
    var item = $(id);
    setActiveItem(item);
    displayItem(item.attr("href"));
  };

  var displayItem = function(url){
    var itemDisplay = $("#item-display");
    var finished = false;

     setTimeout(function(){
        if(!finished){
          itemDisplay.addClass("loader");
        }
      }, 50);      

      $.get(url, function(data){
        finished = true;
        itemDisplay.removeClass("loader");
        itemDisplay.html(data);
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
    items.each(function(index){
      var item = $(this);      
      var id = item.data('id');
      var labels = _.map(labelData[id].labels, function(l){
        var el = $("<span class='label label-info'></span>");
        el.text(l);
        return el;
      });
      item.find(".label").remove();
      item.find(".item-description").after(labels);
    });    
  };

  var getLabels = function(){
    var selectedItems = _getSelected();
    var labelElements = selectedItems.find(".label");
    var labels = {};
    _.each(labelElements, function(l){
      var label = $(l).text();
      var id = $(l).parents('tr.selected').data('id');
      if(labels[label]){
        labels[label].count += 1;
        labels[label].items.push(id);
      }
      else{
        labels[label] = {count : 1, items : [id]};
      }      
    });
    for(var i in labels){
      labels[i].all = labels[i].count === selectedItems.length;      
    }    
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