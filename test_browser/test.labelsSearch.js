expect = chai.expect;

/*
  Html is prepped with:
  input#add_label
  ul#result
  script#label_template
*/

describe("label search", function(){
  var labels = {};
  var template = {};
  template.element =function(){ return $("#result");};
  var selector = aa.labelSearch;
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
        return {matches : [q]};
      }
      template.render = function(data){
        expect(data.matches[0]).to.equal("a");
        done();
      };

      selector.init(selectorOptions);

      selector.search("a");
    });

    it("with preselected items, should select when searching", function(done){
      labels.search = function(q){
        return { matches : ["a"] };
      }
      template.render = function(data){
        expect(data.selectedLabels["a"]).to.be.an('object');
        selectorOptions.selectedLabels = {}; //clean up
        done();
      };

      selectorOptions.selectedLabels = { a : {}};

      selector.init(selectorOptions);

      selector.search("a");
    });
  });

 
});