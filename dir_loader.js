var fs = require('fs');
var enableLogging = false;
var red = '\u001b[31m';
var blue = '\u001b[34m';
var reset = '\u001b[0m';

function log(){
  if(enableLogging){
    console.log(arguments[0], Array.prototype.splice.call(arguments, 1, arguments.length));
  }
}

function load(path, required, el){
  var required = required || {};
  var files = fs.readdirSync(path);
  enableLogging = el;

  files.forEach(function(f){
    var filename;
    var filepath = path + f;
    var stats = fs.statSync(filepath);
    
    if(stats.isFile() && f.match(/.js$/g)){
        filename = f.split('.')[0];

        log("found js: ", filename);
        log(red + "trying to require: %s" + reset, filepath);

        required[filename] = require(filepath);
    }
    else if(stats.isDirectory()){
      log("directory found: ", f);  
      load(filepath + "/", required, el);
    }
    else{
      log("ignoring: ", f)
    }
  });
  return required;
};

exports.load = load;