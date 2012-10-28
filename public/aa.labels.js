var aa = aa || {}; 

aa.labels = (function(){
  var _items = [];      

  var _hasExactMatch = function(matches, query){
    for(var i = 0, l = matches.length; i < l; i++){
      if(matches[i] === query){
        return true;          
      }
    }
    return false;
  };

  return {
    load : function(items){
      _items = items || [];
    },
    all : function(){
      return _items.slice(0);
    },
    find: function(query){
      var searchResult = [];
      if(!query){
        return _items.slice(0);
      }
      for(var i = 0, itemCount = _items.length; i < itemCount; i++){
        if(_items[i].indexOf(query) === 0){
          searchResult.push(_items[i]);
        }
      }
      return searchResult;
    },
    search : function(query){    
      query = query || "";  
      var matches = this.find(query);
      var exactMatch = _hasExactMatch(matches, query);      

      return {
        matches : matches,
        exactMatch : exactMatch,
        query : query
      }
    }    
  };
}());

aa.labelTemplate = (function(){
  var _template,
      _templateElement;

  return {
    setTemplate : function(template){
      _template = _.template($(template).html()); //precompile
    },
    setTemplateElement : function(selector){
      _templateElement = $(selector);
    },
    render : function(data){
      var result = this.run(data);
      _templateElement.html(result);
    },
    run : function(data){
      return _template(data);
    },
    element : function(){
      return _templateElement;
    }
  };
}());

aa.labelSelection = (function(){
  var _initialSelection,
  _currentSelection,
  _selectionChanged = false;

  return {
    init : function(initialSelection){
      _initialSelection = initialSelection || {};
      _currentSelection = _.clone(_initialSelection);      
    },
    select : function(label){
      if(_currentSelection[label]){
        delete _currentSelection[label];
      }
      else{
        _currentSelection[label] = {};
      }
      
      _selectionChanged = !_.isEqual(_currentSelection, _initialSelection);
    },
    get : function(){
      return {
        selectionChanged : _selectionChanged,
        selectedLabels : _currentSelection
      };      
    },
    list : function(){
      return _.keys(_currentSelection);
    }
  };
}());

aa.labelSearch = (function(){
  var _labels,
      _searchField,
      _template,      
      _searchResult,
      _onApply,
      _onCreate,
      _selection;

  var search = function(query){    
    _searchResult = _labels.search(query);       
    render();
  };
  var render = function(){    
    var o = $.extend({}, _searchResult, _selection.get());    
    _template.render(o);
  };
  var setupEvents = function(){
    _searchField.off("keyup");
    _template.element().off("click");

    _searchField.keyup(function(e){       
      if(e.keyCode === 13){ //press enter        
        $(".create-label").trigger("click");
      }
      else{
        search(_searchField.val());        
      }
    });

    _template.element().on("click", function(e){
      var target = $(e.target);      
      
      if(!target.is("li")){
        target = target.parent("li");
      }

      if(target.is(".label-c")){
        _selection.select(target.data("label"));
        render();
      }     
      else if(target.is(".apply-label")){
        _onApply(_selection.list());
      }
      else if(target.is(".create-label")){
        _onCreate(_searchResult.query);
      }
    });
  }; 

  return {
    init : function(options){
      var that = this;

      _labels = options.labels;
      _searchField = $(options.searchField);
      _template = options.template;
      _selection = options.selection; 
      
      _onApply = options.onApply || function(e){};
      _onCreate = options.onCreate || function(e){};      
      
      setupEvents();  
    },
    search : search
  }
}());

aa.backlogLabels = (function(){
  var _labels,
      _template,
      _selection,
      _searcher,
      _createLabelForm;

  var onApplyExistingLabel = function(labels){
    var data = {
      backlog_id : $("#add_label_backlog_id").val(),
      items : aa.backlogitems.getSelectedItemsId(),
      labels : labels
    };
    $.post("/backlog-item/label", data, function(d){
      aa.backlogitems.setLabels(data.labels);
      _selection.init();
      aa.backlogitems.clearSelection();
      $("#toggle_labels").trigger("click");      
    }).error(function(r){
      alert(r.responseText);
    });
  };
  var onCreateNewLabel = function(label){
    var data = _createLabelForm.serialize();
    data.items = aa.backlogitems.getSelectedItemsId();
    $.post(_createLabelForm.attr("action"), data, function(d){
      console.log("created");
    }).error(function(r){
      alert(r.responseText);
    });
  };

  var onOpenLabelDropdown = function(){
    var labels = aa.backlogitems.getLabels();    
    _selection.init(labels);

    $("#add_label_textfield").val('');
    $("#add_label_textfield").focus();
    _searcher.search();
  }

  return {
    init : function(labelData){
      _labels = aa.labels;
      _labels.load(labelData);

      _template = aa.labelTemplate;
      _template.setTemplate("#label_template");
      _template.setTemplateElement("#labels");

      _selection = aa.labelSelection;      

      _searcher = aa.labelSearch;
      _searcher.init({
        searchField : "#add_label_textfield",
        template : _template,      
        labels : _labels,
        selection : _selection,
        onApply : onApplyExistingLabel,
        onCreate : onCreateNewLabel
      });

      $("#toggle_labels").on("click", function(){
        var isCurrentlyOpen = $(this).parent(".btn-group").hasClass("open");
        
        if(!isCurrentlyOpen){
          onOpenLabelDropdown();
        }
      });

      _createLabelForm = $("#add_label_form");

      //to avoid menu from closing
      $("#label-menu").click(function(e){ e.stopPropagation();});      
    }
  };
}());