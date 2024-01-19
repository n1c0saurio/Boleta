const userValidations = require('../validators/user');
const currencies = require('@dinero.js/currencies');
const passport = require('../passport');

const langmap = require('../public/javascripts/language-mapping-list');

// Display home/login page
exports.getLogin = (req, res, next) => {
  if (req.user) {
    res.redirect('/listas');
  }
  errors = req.query;
  res.render('user/login', { errors: errors });
}

// Authenticate a user and redirect to dashboard
exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/listas',
    failureRedirect: '/?invalid_credentials=true'
  })(req, res, next);
}

// Log out a user and redirect to home
exports.logout = (req, res, next) => {
  req.logout(error => {
    if (error) return next(error);
    res.redirect('/');
  });
}

// Show registration form
exports.getRegister = (req, res, next) => {
  res.render('user/register', {
    formData: {},
    langmap: langmap,
    browserLocale: req.languages,
    currencies: currencies,
    errors: {}
  });
}

// Register a new user and redirect to dashboard if registration is successful
exports.postRegister = async (req, res, next) => {
  const errors = await userValidations.registerForm(req.body);
  if (errors) {
    res.render('user/register', {
      formData: req.body,
      langmap: langmap,
      currencies: currencies,
      errors: errors
    });
  } else {
    passport.authenticate('local', {
      successRedirect: '/listas',
      failureRedirect: '/registro'
    })(req, res, next);
  }
}

// Display page to request a password reset
exports.getResetPasswordRequest = (req, res, next) => {
  // TODO: ask for a email to send a reset password token
}

// Display password reset page for a valid token
exports.getResetPassword = (req, res, next) => {
  // TODO: if the token is valid, should display a form to reset the password
}

// Reset a user password and redirect to home if update was succesful
exports.postResetPassword = (req, res, next) => {
  // TODO: should validate the password, update it
  // and inform it was reseted successfully
}
