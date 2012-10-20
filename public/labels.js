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

aa.labelSearch = (function(){
  var _labels,
      _searchField,
      _template,
      _selectedLabels,
      _searchResult,
      _onApply,
      _onCreate;

  var search = function(query){    
    _searchResult = _labels.search(query);  

    if(!_searchResult.selectedLabels){
      _searchResult.selectedLabels = {};
      for(var i in _selectedLabels)
        _searchResult.selectedLabels[i] = _selectedLabels[i];      
    }
    if(typeof _searchResult.stateChanged === 'undefined')
      _searchResult.stateChanged = false;

    render();
  };
  var render = function(){
    _template.render(_searchResult);
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

      if(target.is(".label")){
        selectLabel(target.data("label"));
        render();
      }     
      else if(target.is(".apply-label")){
        _onApply(_searchResult.selectedLabels);
      }
      else if(target.is(".create-label")){
        _onCreate(_searchResult.query);
      }
    });
  };
  
  var selectLabel = function(l){
    var index = _searchResult.matches.indexOf(l);
    var match = _searchResult.matches[index];

    if(_searchResult.selectedLabels[match]){
      delete _searchResult.selectedLabels[match];
    }
    else{
      _searchResult.selectedLabels[match] = {};
    }
    
    _searchResult.stateChanged = !_searchResult.selectedLabels.equals(_selectedLabels);
  };

  return {
    init : function(options){
      var that = this;
      _labels = options.labels;
      _searchField = $(options.searchField);
      _template = options.template;
      _selectedLabels = options.selectedLabels || {};
      _onApply = options.onApply || function(e){};
      _onCreate = options.onCreate || function(e){};
      
      setupEvents();  
    },
    search : search
  }
}());


Object.prototype.equals = function(x)
{
  var p;
  for(p in this) {
      if(typeof(x[p])=='undefined') {return false;}
  }

  for(p in this) {
      if (this[p]) {
          switch(typeof(this[p])) {
              case 'object':
                  if (!this[p].equals(x[p])) { return false; } break;
              case 'function':
                  if (typeof(x[p])=='undefined' ||
                      (p != 'equals' && this[p].toString() != x[p].toString()))
                      return false;
                  break;
              default:
                  if (this[p] != x[p]) { return false; }
          }
      } else {
          if (x[p])
              return false;
      }
  }

  for(p in x) {
      if(typeof(this[p])=='undefined') {return false;}
  }

  return true;
}