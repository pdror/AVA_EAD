var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
var session = require('express-session')
var flash = require('connect-flash')
var passport = require('passport')
require('./config/auth')(passport)
//require('./public/javascripts/scripts')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var courseRouter = require('./routes/course');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'handlebars');

//Body Parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//Public
app.use(express.static('public'));

//HANDLEBARS
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// BANCO DE DADOS CONFIGURAÇÃO
mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb+srv://pedror:avaeadp7@cluster0-byk7c.mongodb.net/ava?retryWrites=true&w=majority',
  {useUnifiedTopology: true, useNewUrlParser: true}).then(() => {
  console.log('Connected to database')
}).catch((err) => {
  console.log(err)
});

  //app.use(logger('dev'));
  //app.use(express.json());
  //app.use(cookieParser());

//SESSION
app.use(session({
  secret: "whose magi 67th blest",
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//MESSAGES
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

// ROTAS

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/course', courseRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//  next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
  console.log(`Server running`)
})

module.exports = app;
