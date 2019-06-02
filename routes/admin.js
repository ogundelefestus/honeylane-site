var express = require('express');
var router = express.Router();
var passport = require('passport');
var Student = require('../model/student');
var Result = require('../model/result');

function assignGrade(arr){
	let gradeArr = []
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] >= 80){
             gradeArr.push("A")
		}
		else if (arr[i] >= 70 && arr[i] <= 79) {
			gradeArr.push("B");
		}
		else if (arr[i] >= 60 && arr[i] <= 69 ) {
			gradeArr.push("C")
		}
		else if (arr[i] >= 50 && arr[i] <= 59) {
			gradeArr.push("D")
		}
		else if (arr[i] >=40 && arr[i] <= 49) {
			gradeArr.push("E")
		}
		else{
			gradeArr.push("F")
		}
	}
	return gradeArr;
}


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
		res.render('admin/manage-result', {title : 'Manage Student Result', student: student})
	})
	.catch(err => {
		console.log("Error" + err);
	})
	
})

router.get('/view-result', (req, res, next) => {
	if (req.session.result) {
		let result = req.session.result;
		let student = req.session.student;
		req.session.student = null;
		req.session.result = null;
		res.render('admin/view-result', {title : 'Student Result', student : student, result : result})
	}
})

router.post('/search-result', (req, res, next) => {
	Result.find({year : req.body.year, student_id : req.body.student_id})
	.then(result => {
		console.log(result)
		Student.find({_id : req.body.student_id})
		.then(student => {
			console.log(student);
			req.session.student = student;
			req.session.result = result;
			res.redirect('/admin/view-result');
		})
		.catch(err => {
			console.log(err);
		})
	})
	.catch(err => {
		console.log(err);
	})
})

router.post('/add-result', (req, res, next) => {
	let subjects = req.body.subjects.split(',');
	let ca_scores = req.body.ca_scores.split(',').map(Number);
	let exam_scores = req.body.exam_scores.split(',').map(Number);
	let totals = req.body.totals.split(',').map(Number);
	
	ca_average = ca_scores.reduce(function (sum, value) {
        return sum + value;
    }, 0) / ca_scores.length;
    exam_average = exam_scores.reduce(function (sum, value) {
        return sum + value;
    }, 0) / ca_scores.length;
    total_average = totals.reduce(function (sum, value) {
        return sum + value;
    }, 0) / ca_scores.length;

    let grade = assignGrade(totals);
    console.log("This is the grade ", grade);
	Result.find({year : req.body.year, student_id : req.body.student_id})
	.then(result => {
		if (result.length < 1 || result == undefined) {
			let newResult = new Result({
				student_id : req.body.student_id,
				subjects : subjects,
				ca_score : ca_scores,
				exam_score : exam_scores,
				total : totals,
				ca_average: ca_average.toFixed(2),
				exam_average: exam_average.toFixed(2),
				total_average: total_average.toFixed(2),
				grade : grade,
				year : req.body.year,
				remark : req.body.remarks,
				school_opened : req.body.school_opened,
				student_present : req.body.days_present,
				student_absent : req.body.days_absent
			});
			newResult.save()
			.then(result => {
				req.flash('success', 'Result for Student has been Added');
				res.redirect('/admin/dashboard');
			})
			.catch(err => {
				console.log(err);
			})
		}
		else {
			req.flash('error', 'Student already has result for that Year and Term');
		    res.redirect('/admin/dashboard');
		}
	})
	.catch(err => {

	})
})

// Admin Dashboard Page
router.get('/dashboard', (req, res, next) => {
	Student.find({})
	.then(student=> {
		var messages = req.flash('error');
		var successMsg = req.flash('success');
		res.render('admin/dashboard', {title: 'Honeylane Schools | Admin Dashboard', student: student, successMsg: successMsg, noMessages: !successMsg, messages: messages, hasErrors: messages.length > 0});
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
		age: req.body.age,
		sex: req.body.sex,
		religion: req.body.religion,
		term_joined: req.body.term_joined,
		state_of_origin : req.body.state_of_origin
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