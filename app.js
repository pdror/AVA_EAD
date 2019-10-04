var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var handlebars = require('express-handlebars')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var newStudentRouter = require('./routes/newStudent');
var courseRouter = require('./routes/course');

//MODELS
require('./models/Course')
require('./models/Student')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//HANDLEBARS
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// BANCO DE DADOS CONFIGURAÇÃO
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://pedror:avaeadp7@cluster0-byk7c.mongodb.net/admin?retryWrites=true&w=majority').then(() => {
  console.log('Connected to database')
}).catch((err) => {
  console.log(err)
});

// ROTAS
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/newStudent', newStudentRouter);
app.use('/course', courseRouter);

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

module.exports = app;
