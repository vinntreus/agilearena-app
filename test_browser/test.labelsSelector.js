expect = chai.expect;

/*
  Html is prepped with:
  input#add_label
  ul#result
  script#label_template
*/

describe("label selector", function(){
  var labels = {};
  var template = {};
  var selector = aa.labelSelector;
  var selectorOptions = {      
    searchField : "#add_label",
    template : template,
    labels : labels
  };  
  var searchField = $(selectorOptions.searchField);

  describe("init", function(){

    afterEach(function(){
      searchField.val("");
      labels.search = function(){};
    });

    it("should set keyup event on search field to search labels", function(done){
      labels.search = function(q){
        expect(q).to.equal("a");
        done();
      }

      selector.init(selectorOptions);
      
      searchField.val("a");
      searchField.trigger("keyup");
    });   
  });

  describe("search", function(){
     it("searching should render template", function(done){
      labels.search = function(q){
        return q;
      }
      template.render = function(data){
        expect(data).to.equal("a");
        done();
      };

      selector.init(selectorOptions);

      selector.search("a");
    });
  });
});