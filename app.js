var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var validator = require('express-validator');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var keys = require('./keys.js');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true }).then(//useNewUrlParser: true,
  function(res){
   console.log("Connected to Database Successfully.");
  }
).catch(function(err){
  console.log("Connection to Database failed.");
  console.log(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log("App is running on Port 5000")

module.exports = app;
