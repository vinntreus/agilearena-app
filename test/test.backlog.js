var Backlog = require('../domain/backlog.js');
var assert = require('assert');


var createEmptyBacklog = function(options){
  options = options || {_id : 1, name : "a", owner : "b", created : "c"};
  return new Backlog(options);  
};


describe("Backlog", function(){

  it('create with valid args', function() {
    var options = {_id : 1, name : "a", owner : "b", created : "c"};
    var b = createEmptyBacklog(options);
    
    assert.equal(b._id, 1, 'id should be one');
    assert.equal(b.name, "a", 'name should be a');
    assert.equal(b.owner, "b", 'owner should be b');
    assert.equal(b.created, "c", 'created should be c');
  });

  it('can add item with description', function(){
    var b = createEmptyBacklog();
    var result = b.addItem({ description : "a"});

    assert.equal(result, null, "should not have error messages");
    assert.ok(b.items.length === 1, "should have one item");
  });

  it('add item throws when no item', function(){
    var b = createEmptyBacklog();
    var result = b.addItem();

    assert.equal(result, "Cannot add empty item");
  });

  it('add item throws when item has no description', function(){
    var b = createEmptyBacklog();
    var result = b.addItem({ a : "b"});

    assert.equal(result, "Cannot add empty item");
  });

  it('add item throws when item has empty description', function(){
    var b = createEmptyBacklog();
    var result = b.addItem({ description : ""});
    
    assert.equal(result, "Cannot add empty item");
  });

});