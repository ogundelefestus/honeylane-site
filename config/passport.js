var passport = require('passport');
var User = require('../model/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
	// body...
	done(null, user.id);
});


passport.deserializeUser(function (id, done){
	User.findById(id, function (err, user){
		done(err, user);
	});
});


passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done){
    req.checkBody('username', 'Invalid username').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'username' : username}, function (err, user){
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'No user found' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Wrong password' });
        };
        console.log("User Found. logging in!!");
        return done(null, user);
    });
}));