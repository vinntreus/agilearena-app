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
    },
    init : function(options){
      var that = this;
      var searchField = $(options.searchField);
      var template = _.template($(options.template).html()); //precompile
      var resultElement = $(options.resultElement);  
      
      var doSearch = function(query){
        var result = that.search(query);
        resultElement.html( template(result) );
      };
      searchField.keyup(function(e){        
        doSearch(searchField.val());
      });

      doSearch("");
    }
  };
}());