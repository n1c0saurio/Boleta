const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
// User session managment
const session = require('express-session');
const passport = require('./passport');
const userMiddleware = require('./middlewares/user');
// Localization tools
const i18n = require('i18next');
const i18nMiddleware = require('i18next-http-middleware');
const i18nBackend = require('i18next-fs-backend');
// Custom routers
const indexRouter = require('./routes/index');
const listsRouter = require('./routes/lists');
const userRouter = require('./routes/user');

const app = express();

// Backend utilities
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Frontend utilities
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use("/stylesheets/icons", express.static(path.join(
  __dirname, "node_modules/bootstrap-icons/font")));
app.use("/javascripts/bootstrap", express.static(path.join(
  __dirname, "node_modules/bootstrap/dist/js")));

// Localization setup
i18n
  .use(i18nBackend)
  .use(i18nMiddleware.LanguageDetector)
  .init({
    ns: ['common', 'index', 'user', 'dashboard'],
    defaultNS: 'common',
    fallbackLng: 'en',
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json'
    }
  });
app.use(i18nMiddleware.handle(i18n));

// User session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Custom routes
app.use('/', indexRouter);
app.use('/listas', userMiddleware.authRequired, listsRouter);
app.use('/mi-cuenta', userMiddleware.authRequired, userRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
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
