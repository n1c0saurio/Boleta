var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var session = require('express-session');
var passport = require('./passport');
var listsRouter = require('./routes/lists');
var userRouter = require('./routes/user');

var app = express();

// server-side utilities
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// client-side utilities
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use("/stylesheets/icons", express.static(path.join(
  __dirname,
  "node_modules/bootstrap-icons/font"
)));
app.use("/javascripts/bootstrap", express.static(path.join(
  __dirname,
  "node_modules/bootstrap/dist/js"
)));

// user session
app.use(session({
  secret: process.env.SESION_SECRET, // TODO: fix typo
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// custom routes
app.use('/listas', listsRouter);
app.use('/', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  // error details
  console.log('\nError details:');
  console.error(err.stack);
});

module.exports = app;
