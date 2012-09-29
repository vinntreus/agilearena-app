var Backlog = require('../domain/backlog.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
var createEmptyBacklog = function(options){
  options = options || {_id : 1, name : "a", owner : "b", created : "c"};
  return new Backlog(options);  
};


exports['backlog'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'create with valid args': function(test) {
    test.expect(4);
    // tests here
    var options = {_id : 1, name : "a", owner : "b", created : "c"};
    var b = createEmptyBacklog(options);
    
    test.equal(b._id, 1, 'id should be one');
    test.equal(b.name, "a", 'name should be a');
    test.equal(b.owner, "b", 'owner should be b');
    test.equal(b.created, "c", 'created should be c');

    test.done();
  },
  'can add item with description' : function(test){
    test.expect(2);

    var b = createEmptyBacklog();
    var result = b.addItem({ description : "a"});

    test.equal(result, null, "should not have error messages");
    test.ok(b.items.length === 1, "should have one item");

    test.done();
  },
  'add item throws when no item' : function(test){
    test.expect(1);

    var b = createEmptyBacklog();
    var result = b.addItem();

    test.equal(result, "Cannot add empty item");

    test.done();
  },
  'add item throws when item has no description' : function(test){
    test.expect(1);

    var b = createEmptyBacklog();
    var result = b.addItem({ a : "b"});

    test.equal(result, "Cannot add empty item");

    test.done();    
  },
  'add item throws when item has empty description' : function(test){
    test.expect(1);

    var b = createEmptyBacklog();
    var result = b.addItem({ description : ""});
    
    test.equal(result, "Cannot add empty item");

    test.done();
  }
};