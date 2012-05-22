(function($, ko){

  if(typeof backlogViewModel !== 'undefined') {
    ko.applyBindings(new backlogViewModel(backlogItems));
  }

}($, ko));