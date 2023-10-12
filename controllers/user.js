const userValidations = require('../validators/user');

exports.getMyAccount = (req, res, next) => {
  res.render('user/my-account', { user: req.user, errors: {} });
}

exports.updateMyAccount = async (req, res, next) => {
  let errors;
  // Run the corresponding validator depending of the form submitted
  if (req.body.fromForm === 'updateUser') {
    errors = await userValidations.updateMyAccount(req.user.id, req.body);
    // also update the new values on the `req.user` object
    req.user.firstName = req.body.firstName;
    req.user.lastName = req.body.lastName;
    req.user.email = req.body.email;
  } else if (req.body.fromForm === 'updatePassword') {
    errors = await userValidations.updatePassword(req.user.id, req.body);
  }
  res.render('user/my-account', { user: req.user, errors: (errors) ? errors : {} });
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
