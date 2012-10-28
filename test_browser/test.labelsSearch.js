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
    labels : labels,
    selection : { get : function(){ return {};}}
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

    it("should add selection to rendering when searching", function(done){
      labels.search = function(q){
        return { matches : ["a"] };
      }
      selectorOptions.selection.get = function(){
        return { a : {}}
      }
      template.render = function(data){
        expect(data.a).to.be.an('object');
        selectorOptions.selection.get = function(){ return {};}; //clean up
        done();
      };

      selector.init(selectorOptions);

      selector.search("a");
    });
  });

  describe("selection", function(){
    var s = aa.labelSelection;

    describe("init", function(){
      it("undefined initial selection makes current selection empty", function(){
        s.init();

        expect(s.get().selectedLabels).to.eql({});
      });

      it("undefined initial selection makes selectionChanged = false", function(){
        s.init();

        expect(s.get().selectionChanged).to.be.false;
      });

       it("with initial selection makes current selection clone of initial", function(){
        var o = {a : {}}; 
        s.init(o);

        expect(s.get().selectedLabels).to.eql(o);
        expect(s.get().selectedLabels).to.not.equal(o);
      });

      it("with initial selection makes selectionChanged = false", function(){
        s.init({a : {}});

        expect(s.get().selectionChanged).to.be.false;
      });
    });

    describe("select", function(){
      it("intial selection = 'a', selecting 'a' unselects it", function(){
        s.init({a : { all : true}});

        s.select('a');

        expect(s.get().selectedLabels).to.eql({})
      });

      it("changing selection will set selectionChanged = true", function(){
        s.init({a : { all : true}});

        s.select('a');

        expect(s.get().selectionChanged).to.be.true;
      });

      it("changing selection back to intial state will set selectionChanged = false", function(){
        s.init({a : { all : true }});

        s.select('a');
        s.select('a');        

        expect(s.get().selectionChanged).to.be.false;
      });

      it("selecting new label, adds it to current selection", function(){
        s.init();

        s.select('a');

        expect(s.get().selectedLabels).to.eql({ a : { all : true }});
      });

      it("changing partial selection first time set selectionChanged = true", function(){
        s.init({a : { all : false }});
        
        s.select('a');        

        expect(s.get().selectionChanged).to.be.true;        
      });

      it("changing partial selection first time selects all", function(){
        s.init({a : { all : false }});

        s.select('a');

        expect(s.get().selectedLabels['a'].all).to.be.true;
      });

      it("changing partial selection second time set selectionChanged = true", function(){
        s.init({a : { all : false }});
        
        s.select('a');
        s.select('a');        

        expect(s.get().selectionChanged).to.be.true;        
      });

      it("changing partial selection second time deselects all", function(){
        s.init({a : { all : false }});

        s.select('a');
        s.select('a');

        expect(s.get().selectedLabels).to.eql({});
      });

      it("changing partial selection third time set selectionChanged = false", function(){
        s.init({a : { all : false }});
        
        s.select('a');
        s.select('a');
        s.select('a');

        expect(s.get().selectionChanged).to.be.false;
      });

      it("changing partial selection second time deselects all", function(){
        s.init({a : { all : false }});

        s.select('a');
        s.select('a');
        s.select('a');

        expect(s.get().selectedLabels['a'].all).to.be.false;
      });
    });
  });

 
});