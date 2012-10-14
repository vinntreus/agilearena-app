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
      _template;

  var search = function(query){    
    var result = _labels.search(query);    
    _template.render(result);
  };
  var setupEvents = function(){
    _searchField.keyup(function(e){ 
      search(_searchField.val());        
    });

    _template.element().on("click", function(e){
      var target = $(e.target);      
      if(target.is(".label")){        
        target.toggleClass("selected");
      }
      else if(target.parent().is(".label"))
      {
        target.parent().toggleClass("selected");
      }
    });
  };

  return {
    init : function(options){
      var that = this;
      _labels = options.labels;
      _searchField = $(options.searchField);
      _template = options.template;
      
      setupEvents();  
    },
    search : search
  }
}());