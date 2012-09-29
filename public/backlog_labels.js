
var labels = (function(){
  var dropdownmenu = $('ul#labels');
  var suggestionLi = $('ul#labels li.suggestion');

  var suggestion = $('#label-suggestion');
  var form = $('ul#labels form');
  var labelSearchField = $('input#add_label');

  var searchLabel = function(){
    var searchText = labelSearchField.val();
    if(searchText.length > 0 && !matchExistingLabels(searchText)){
      showSuggestion(searchText);
    }
    else{
      hideSuggestion();
    }
  };
  var matchExistingLabels = function(searchText){
    var foundMatch = false;
    $('.dropdown-menu li.l a').each(function(index){
      if($(this).text() === searchText){
        foundMatch = true;
      }
    });
    return foundMatch;
  };
  var hideSuggestion = function(){
    suggestionLi.hide();
    suggestion.text('');
  };
  var showSuggestion = function(searchText){
    var text = "Create \"" + searchText + "\"";    
    suggestion.text(text);
    suggestionLi.show();    
  };

  var createLabel = function(){
    var data = form.serialize();
    $.post(form.attr("action"), data, function(){
      var newLabel = $("<li class='l'><a href='#'>" + labelSearchField.val() + "</a></li>");
      dropdownmenu.append(newLabel);
      hideSuggestion();
      labelSearchField.val('');
    }).error(function(e){      
      alert(e.responseText);
    });
  };


  return {
    init : function(){
      suggestionLi.hide();
      form.click(function(e){ e.stopPropagation();});
      labelSearchField.keyup(searchLabel);
      suggestion.click(function(e){ createLabel(); });
      $('ul#labels li.l a').live("click", function(e){
        e.stopPropagation();
        var url = dropdownmenu.data('addbacklogitemlabelurl');
        var items = $.map($(".backlog-items .selected"), function(item){
          return $(item).data("id");
        });
        var data = {
          backlog_id : $("#backlog_id").val(),
          backlog_item_ids : items,
          label : $(this).text()
        };
        $.post(url, data, function(){
          $(".backlog-items .selected .label").append(data.label);
        }).error(function(e){
          alert(e.responseText);
        });
      });
    }
  };

}());