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
    add : function(item){
      _items.push(item);
    },
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
      _currentSelection = {};
      _selectionChanged = false;

      for(var i in _initialSelection){
        if(_.isObject(_initialSelection[i])){
          _currentSelection[i] = _.clone(_initialSelection[i]);
        }
      }
    },
    select : function(label){
      if(_currentSelection[label] && _currentSelection[label].all){
        delete _currentSelection[label];
      }
      else if(!_currentSelection[label] && _initialSelection[label] && !_initialSelection[label].all){
        _currentSelection[label] = _.clone(_initialSelection[label]);
      }
      else if(_initialSelection[label]){
        _currentSelection[label] = _.clone(_initialSelection[label]);
        _currentSelection[label].all = true;        
      }
      else {
        _currentSelection[label] = { all : true };
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
var KEYCODE = {
  ENTER : 13
};
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

    _searchField.keydown(function(e){
      if(e.keyCode === KEYCODE.ENTER){
        e.preventDefault();
        $(".create-label").trigger("click");
      }
    });

    _searchField.keyup(function(e){
      if(e.keyCode !== KEYCODE.ENTER){
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
        _onApply(_selection.get());
      }
      else if(target.is(".create-label")){
        _selection.select(_searchResult.query);
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
      items : {}
    };
    
    //init selection without labels
    aa.backlogitems.getSelectedItemsId().forEach(function(i){
      data.items[i] = { labels : [], dummy : 1 }; //dummy is there due to jquery bug, cannot serialize empty arrays.
    });

    //apply selected labels
    for(var i in labels.selectedLabels){
      var label = labels.selectedLabels[i];
      if(label.all){ //should label be applied to complete selection
        for(var j in data.items){ //apply label on every selected item
          data.items[j].labels.push(i);
        }
      }
      else{
        label.items.forEach(function(l){ //apply label on certain items
          data.items[l].labels.push(i);
        });
      }
    }    
    
    $.post("/backlog-item/label", data, function(d){
      aa.backlogitems.setLabels(data.items);
      _selection.init();      
      $("#toggle_labels").trigger("click");      
    }).error(function(r){
      alert(r.responseText);
    });
  };
  var onCreateNewLabel = function(label){    
    var data = _createLabelForm.serialize();
    data.items = aa.backlogitems.getSelectedItemsId();
    
    $.post(_createLabelForm.attr("action"), data, function(d){
      _labels.add(label);
      var selection = _selection.get();        
      selection.selectedLabels[label] = {all : true};
      onApplyExistingLabel(selection);
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