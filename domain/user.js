var sechash = require('sechash');

function User (options){
  this._id = options._id;
  this.username = options.username;
  this.password = options.password; 
};

User.prototype.validPassword = function(passToTryWith){
  return sechash.testBasicHash('sha1', passToTryWith, this.password);
};

module.exports = User;