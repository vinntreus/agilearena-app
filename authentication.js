var Users = require('./domain/user');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function(passport){
  //authentication
  passport.use(new LocalStrategy(
    function(username, password, done) {      
      Users.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Unknown user' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Invalid password' });
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {    
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {      
     done(false, user);  
  });
}

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}