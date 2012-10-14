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

  describe("selecting in search result", function(){


    it("selecting first item with class='label' should add css class", function(){
      template.render = function(data){
        var li = "<li id='label' class='label'>a</li>";
        $("#result").append(li);
      };
      selector.init(selectorOptions);
      selector.search("a");
      $("#label").trigger("click");

      expect($("#label").hasClass("selected")).to.be.true;     

      $("#label").removeClass("selected");
      $("#result").children().remove();       
    });

    it("selecting item without class='label' should not add css class", function(){
      template.render = function(data){
        var li = "<li id='label' >a</li>";
        $("#result").append(li);
      };
      selector.init(selectorOptions);
      selector.search("a");
      $("#label").trigger("click");

      expect($("#label").hasClass("selected")).to.be.false;      

      $("#label").removeClass("selected");
      $("#result").children().remove();
    });

    it("selecting first item with class='label' which already is selected, removes class", function(){
      template.render = function(data){
        var li = $("<li id='label' class='label selected'>a</li>");
        $("#result").append(li);
      };
      selector.init(selectorOptions);
      selector.search("a");
      
      $("#label").trigger("click");
      
      expect($("#label").hasClass("selected")).to.be.false;      

      $("#label").removeClass("selected");
      $("#result").children().remove();      
    });
  
    it("selecting child element of item with class='label' should add css class", function(){
      template.render = function(data){
        var li = "<li id='label2' class='label'><span>a</span></li>";
        $("#result").append(li);        
      };
      
      selector.search("a");
      
      $("#label2 > span").trigger("click");      
      
      expect($("#label2").hasClass("selected")).to.be.true;      
    });

  });
});