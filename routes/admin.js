var express = require('express');
var router = express.Router();
var passport = require('passport');
var Student = require('../model/student');

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
	Student.find({})
	.then(student=> {
		var messages = req.flash('error');
		res.render('admin/dashboard', {title: 'Honeylane Schools | Admin Dashboard', student: student, messages: messages, hasErrors: messages.length > 0});
	})
	.catch(err => {
		console.log(err);
	})
})

router.get('/results', (req, res, next) =>{
	var messages = req.flash('error');
	res.render('admin/results', {title : 'Students Results', messages: messages, hasErrors: messages.length > 0})
})

router.post('/add-new-student', (req, res, next) => {
	console.log(req.body);
	let newStudent = new Student({
		fullname : req.body.fullname,
		class : req.body.class,
		age: req.body.age
	});
	newStudent.save()
	.then(result => {
		req.flash('success', 'The Student Has Been Saved Successfully');
	    console.log("New Blog Post Saved");
	    res.redirect('/admin/dashboard');
	})
	.catch(err => {
		console.log(err);
	})
})

router.get('/delete-student/:_id', function(req, res){
	Student.deleteOne({_id : req.params._id})
	.then(result => {
		req.flash('success', 'Student has been deleted from Database');
		res.redirect('/admin/dashboard')
	})
	.catch(err => {
		console.log("There is an Error");
	})
});

module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}