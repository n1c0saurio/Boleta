const models = require('../db/models');

// Validate user register form
exports.registerForm = async (formData) => {
  try {
    let newUser = await models.User.create({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      passwordConfirmation: formData.passwordConfirmation,
      defaultCurrency: formData.defaultCurrency,
      roleId: 'enduser'
    });
  } catch (err) {
    let errors = {};
    if (err.errors) {
      err.errors.forEach(error => {
        errors[error.path] = error.message;
      });
    } else {
      // TODO: register on Logs
      console.log(err);
    }
    return errors;
  }
}

exports.updateMyAccount = async (id, formData) => {
  try {
    let user = await models.User.findOne({ where: { 'id': id } });
    await user.update({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email
    });
  } catch (err) {
    let errors = {};
    if (err.errors) {
      err.errors.forEach(error => {
        errors[error.path] = error.message;
      });
    } else {
      // TODO: save on log
      console.log(err);
    }
    return errors;
  }
}

exports.updatePassword = async (id, formData) => {
  try {
    let user = await models.User.findOne({ where: { 'id': id } });
    await user.update({
      password: formData.password,
      passwordConfirmation: formData.passwordConfirmation
    });
  } catch (err) {
    let errors = {}
    if (err.errors) {
      err.errors.forEach(error => {
        errors[error.path] = error.message;
      });
    } else {
      // TODO: save on log
      console.log(err);
    }
    return errors;
  }
}