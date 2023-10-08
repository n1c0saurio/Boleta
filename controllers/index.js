const userValidations = require('../validators/user');
const currencies = require('@dinero.js/currencies');
const passport = require('../passport');

const langmap = require('../public/javascripts/language-mapping-list');

exports.getLogin = (req, res, next) => {
  if (req.user) {
    res.redirect('/listas');
  }
  errors = req.query;
  res.render('user/login', { errors: errors });
}

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/listas',
    failureRedirect: '/?invalid_credentials=true'
  })(req, res, next);
}

exports.logout = (req, res, next) => {
  req.logout(error => {
    if (error) return next(error);
    res.redirect('/');
  });
}

exports.getRegister = (req, res, next) => {
  res.render('user/register', {
    formData: {},
    langmap: langmap,
    currencies: currencies,
    errors: {}
  });
}

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

exports.getResetPasswordRequest = (req, res, next) => {
  // TODO: ask for a email to send a reset password token
}

exports.getResetPassword = (req, res, next) => {
  // TODO: if the token is valid, should display a form to reset the password
}

exports.postResetPassword = (req, res, next) => {
  // TODO: should validate the password, update it
  // and inform it was reseted successfully
}
