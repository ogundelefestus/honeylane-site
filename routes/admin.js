var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/login', { title: 'Honeylane Schools | Admin' });
});


router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
}));

router.get('/dashboard', (req, res, next) => {
	res.render('admin/dasboard', {title: 'Honeylane Schools | Admin Dashboard'});
})

module.exports = router;