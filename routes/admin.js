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

router.get('/manage-result/:id', (req, res, next) => {
	var student_id = req.params.id;
	Student.find({_id : student_id})
	.then(student => {
		console.log(student);
		res.render('admin/manage-result', {title : 'Manage Student Result', student: student})
	})
	.catch(err => {
		console.log("Error" + err);
	})
	
})

// Admin Dashboard Page
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


//List Search Result Page
router.get('/search', (req, res, next) =>{
	if (req.session.students) {

        var students = req.session.students;
        // console.log("These are the students ", students);
        req.session.students = null;
        var messages = req.flash('error');
		res.render('admin/search', {title : 'Search Results', students : students, messages: messages, hasErrors: messages.length > 0})
    }
    else {
    	res.redirect('/admin/dashboard');
    }
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

router.post('/search-class', (req, res, next) => {
	let theclass = req.body.class;
	Student.find({class : theclass})
	.then(students => {
		req.session.students = students;
		res.redirect('/admin/search');
	})
	.catch(err => {
		console.log(err);
	})
});

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