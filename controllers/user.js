const langmap = require('../public/javascripts/language-mapping-list');
const currencies = require('@dinero.js/currencies');
const userValidations = require('../validators/user');

// Display my account page
exports.getMyAccount = (req, res, next) => {
  res.render('user/my-account', {
    user: req.user,
    langmap: langmap,
    currencies: currencies,
    errors: {}
  });
}

// Update account data or password and reload the page
exports.updateMyAccount = async (req, res, next) => {
  let errors;
  // Run the corresponding validator depending of the form submitted
  if (req.body.fromForm === 'updateUser') {
    errors = await userValidations.updateMyAccount(req.user.id, req.body);
    // also update the new values on the `req.user` object
    req.user.firstName = req.body.firstName;
    req.user.lastName = req.body.lastName;
    req.user.email = req.body.email;
    req.user.preferredLocale = req.body.preferredLocale
  } else if (req.body.fromForm === 'updatePassword') {
    errors = await userValidations.updatePassword(req.user.id, req.body);
  }
  res.render('user/my-account', {
    user: req.user,
    langmap: langmap,
    currencies: currencies,
    errors: (errors) ? errors : {}
  });
}
