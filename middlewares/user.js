const createError = require('http-errors');

// Views that requires an account, regardless of the role
exports.authRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    next(createError(401, 'Debes iniciar sesión para acceder aquí.'));
  }
}

// Views that requires an Administrator account
exports.adminRequired = (req, res, next) => {

}