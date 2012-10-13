var labels = (function(){
  var _items = [];

  return {
    load : function(items){
      _items = items || [];
    },
    all : function(){
      return _items;
    },
    find: function(query){
      var searchResult = [];
      if(!query){
        return _items;
      }
      for(var i = 0, itemCount = _items.length; i < itemCount; i++){
        if(_items[i].indexOf(query) === 0){
          searchResult.push(_items[i]);
        }
      }
      return searchResult;
    }
  };
}());