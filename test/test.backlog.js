var Backlog = require('../domain/backlog.js');
var assert = require('chai').assert;
var _ = require('underscore');


var createBacklog = function(options){
  var defaultOptions = {_id : 1, name : "a", owner : "b", created : "c"};
  options = _.extend(defaultOptions, options);
  return new Backlog(options);
};


describe("Backlog", function(){

  it('create with valid args', function() {
    var options = {_id : 1, name : "a", owner : "b", created : "c"};
    
    var b = createBacklog(options);
    
    assert.equal(b._id, 1, 'id should be one');
    assert.equal(b.name, "a", 'name should be a');
    assert.equal(b.owner, "b", 'owner should be b');
    assert.equal(b.created, "c", 'created should be c');
  });

  describe("add item", function(){
    it('can add item with description', function(){
      var b = createBacklog();
      
      var result = b.addItem({ description : "a"});

      assert.equal(result, null, "should not have error messages");
      assert.ok(b.items.length === 1, "should have one item");
    });

    it('add item throws when no item', function(){
      var b = createBacklog();
      
      var result = b.addItem();

      assert.equal(result, "Cannot add empty item");
    });

    it('add item throws when item has no description', function(){
      var b = createBacklog();
      
      var result = b.addItem({ a : "b"});

      assert.equal(result, "Cannot add empty item");
    });

    it('add item throws when item has empty description', function(){
      var b = createBacklog();
      
      var result = b.addItem({ description : ""});
      
      assert.equal(result, "Cannot add empty item");
    });
  });

  describe("add label", function(){
    it("one label - should add label to item", function(){
      var b = createBacklog({ items : [{ _id : "a"}]});

      b.addLabelToItem({"a" : {labels : ["b"]}});

      assert.include(b.items[0].labels, "b");
      assert.equal(b.items[0].labels.length, 1);
    });

    it("two labels - should add BOTH labels to item", function(){
      var b = createBacklog({ items : [{ _id : "a"}]});

      b.addLabelToItem({"a" : {labels : ["b", "c"]}});

      assert.include(b.items[0].labels, "b");
      assert.include(b.items[0].labels, "c");
      assert.equal(b.items[0].labels.length, 2);
    });
  });

});