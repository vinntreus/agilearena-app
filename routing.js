var auth = require('./authentication');
var features = require('./dir_loader').load('./ui/');
var redColor = '\033[31m';
var headingColor = '\033[32m';
var resetColor = '\033[0m';

//loads all libs which has an exports.route property

var routeLoader = {
  //events
  preLoad : function(){}, featureFound : function(){}, featureNotFound : function(){}, postLoad : function(){},
  load : function(options){
    this.preLoad();
    for(var i in features){
      if(typeof features[i].route !== 'undefined'){
        features[i].route(options);
        this.featureFound(i);        
      }
      else{
        this.featureNotFound(i);
      }
    }
    this.postLoad(); 
  }
};

var routeLoaderWithLogging = routeLoader;
routeLoaderWithLogging.preLoad = function(){ console.log( headingColor + "start loading features..." + resetColor) };
routeLoaderWithLogging.postLoad = function(){ console.log(headingColor + "Finished loading features." + resetColor) };
routeLoaderWithLogging.featureFound = function(f){ console.log("Found feature: ", f) };
routeLoaderWithLogging.featureNotFound = function(f){ console.log("Found non-feature: ", f) };

exports.map = function(app, passport){
  routeLoaderWithLogging.load({app : app, passport : passport, auth : auth});
};