expect = chai.expect;

describe("labels", function(){
  var labels = aa.labels;

  describe("load", function(){
    it("add zero items, there should be no labels", function(){
      labels.load();

      var all = labels.all();

      expect(all).to.be.a('array');
      expect(all).to.have.length(0);
    });

    it("add one item, there should be one label", function(){
      labels.load(["test"]);

      var all = labels.all();

      expect(all).to.have.length(1);
      expect(all[0]).to.equal("test");
    });

    it("add two item, there should be two labels", function(){
      labels.load(["a", "b"]);

      var all = labels.all();

      expect(all).to.have.length(2);
      expect(all[0]).to.equal("a");
      expect(all[1]).to.equal("b");
    });

    it("loading twice, only second load counts", function(){
      labels.load(["a", "b"]);
      labels.load(["a"]);

      var all = labels.all();

      expect(all).to.have.length(1);
      expect(all[0]).to.equal("a");      
    });
  });

  describe("find", function(){
    it("given labels ['a'], empty query returns all", function(){
      labels.load(["a"]);

      var result = labels.find();

      expect(result).to.have.length(1);
      expect(result[0]).to.equal("a"); 
    });
    
    it("given labels ['a'], find 'a' will match", function(){
      labels.load(["a"]);

      var result = labels.find("a");

      expect(result).to.have.length(1);
      expect(result[0]).to.equal("a"); 
    });
    
    it("given labels ['a', 'b'], find 'a' returns only 'a'", function(){
      labels.load(["a", "b"]);

      var result = labels.find("a");

      expect(result).to.have.length(1);
      expect(result[0]).to.equal("a"); 
    });
    
    it("given labels ['a', 'b'], find 'b' returns only 'b'", function(){
      labels.load(["a", "b"]);

      var result = labels.find("b");

      expect(result).to.have.length(1);
      expect(result[0]).to.equal("b"); 
    });
    
    it("given labels ['a', 'ab'], find 'a' returns both", function(){
      labels.load(["a", "ab"]);

      var result = labels.find("a");

      expect(result).to.have.length(2);      
    });

    it("given labels ['a', 'ab'], find 'b' returns none", function(){
      labels.load(["a", "ab"]);

      var result = labels.find("b");

      expect(result).to.have.length(0);      
    });

    it("given labels ['a', 'ab'], find 'ab' returns 'ab'", function(){
      labels.load(["a", "ab"]);

      var result = labels.find("ab");

      expect(result).to.have.length(1);
      expect(result[0]).to.equal("ab");  
    });

    it("given labels ['a', 'b'], find -> pop -> get all should return two", function(){
      labels.load(["a", "b"]);

      var result = labels.find();
      result.pop();

      var newResult = labels.all();

      expect(newResult).to.have.length(2);
    });

    it("given labels ['a', 'b'], all -> pop -> get all should return two", function(){
      labels.load(["a", "b"]);

      var result = labels.all();
      result.pop();

      var newResult = labels.all();

      expect(newResult).to.have.length(2);
    });

    it("given labels ['a', 'b'], find('a') -> pop -> get all should return two", function(){
      labels.load(["a", "b"]);

      var result = labels.find("a");
      result.pop();

      var newResult = labels.all();

      expect(newResult).to.have.length(2);
    });

   

  });

  describe("search", function(){
    it("given labels ['a', 'b'], search('a') has exact match", function(){
      labels.load(["a", "b"]);

      var result = labels.search("a");

      expect(result.exactMatch).to.be.true;
    });

    it("given labels ['a', 'b'], returns ['a']", function(){
      labels.load(["a", "b"]);

      var result = labels.search("a");

      expect(result.matches).to.eql(["a"]);
    });

    it("given labels ['ab'], search('a') has one partial match", function(){
      labels.load(["ab"]);

      var result = labels.search("a");

      expect(result.exactMatch).to.be.false;
      expect(result.matches).to.eql(["ab"]);
    });
    it("search('a') returns query => 'a'", function(){
      var result = labels.search("a");

      expect(result.query).to.equal('a');      
    });

  });


});