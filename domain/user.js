var sechash = require('sechash');
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  username : String,
  password : String,
  created : { type: Date, default: Date.now }
});
UserSchema.methods.validPassword = function(passToTryWith){
  return sechash.testBasicHash('sha1', passToTryWith, this.password);
};
var Users = mongoose.model('User', UserSchema);

mongoose.connect('mongodb://localhost/agilearena');

module.exports = Users;