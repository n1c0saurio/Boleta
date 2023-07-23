const userValidations = require('../validators/user');
const passport = require('../passport');

exports.showRegister = (req, res, next) => {
  res.render('user/register', { formData: {}, errors: {} });
}

exports.sendRegister = async (req, res, next) => {
  errors = await userValidations.registerForm(req.body);
  if (errors) {
    res.render('user/register', { formData: req.body, errors: errors });
  } else {
    passport.authenticate('local', {
      successRedirect: '/listas',
      failureRedirect: '/registro'
    })(req, res, next);
  }
}

exports.showLogin = (req, res, next) => {
  if (req.user) {
    res.redirect('/listas');
  }
  errors = req.query;
  res.render('user/login', { errors: errors });
}

exports.sendLogin = (req, res, next) => {
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

exports.showMyAccount = (req, res, next) => {
  res.render('user/my-account', { userData: req.user, errors: {} });
}

exports.updateMyAccount = async (req, res, next) => {
  errors = await userValidations.updateMyAccount(req.user.id, req.body);
  if (errors) {
    console.log('where errors');
    res.render('user/my-account', { userData: req.body, errors: errors });
  } else {
    res.render('user/my-account', { userData: req.user, errors: {} });
  }
}