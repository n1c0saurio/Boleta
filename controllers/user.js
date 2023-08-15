const userValidations = require('../validators/user');

exports.getMyAccount = (req, res, next) => {
  res.render('user/my-account', { user: req.user, errors: {} });
}

exports.updateMyAccount = async (req, res, next) => {
  const errors = await userValidations.updateMyAccount(req.user.id, req.body);
  if (errors) {
    res.render('user/my-account', { user: req.body, errors: errors });
  } else {
    res.render('user/my-account', { user: req.user, errors: {} });
  }
}

exports.getUpdatePassword = (req, res, next) => {
  res.render('user/password', { user: req.user, errors: {}, success: false });
}

exports.postUpdatePassword = async (req, res, next) => {
  const errors = await userValidations.updatePassword(req.user.id, req.body);
  if (errors) {
    res.render('user/password', { user: req.user, errors: errors, success: false });
  } else {
    res.render('user/password', { user: req.user, errors: {}, success: true });
  }
}
