var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
	var messages = req.flash('error');
  	res.render('admin/login', { title: 'Honeylane Schools | Admin',  messages: messages, hasErrors: messages.length > 0 });
});


router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin',
    failureFlash: true
}));

router.get('/dashboard', (req, res, next) => {
	var messages = req.flash('error');
	res.render('admin/dashboard', {title: 'Honeylane Schools | Admin Dashboard', messages: messages, hasErrors: messages.length > 0});
})

module.exports = router;