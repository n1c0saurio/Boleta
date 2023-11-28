const models = require('../db/models');

// Validate user register form
exports.registerForm = async (formData) => {
  try {
    let newUser = await models.User.create({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      preferredLocale: formData.preferredLocale,
      defaultCurrency: formData.defaultCurrency,
      password: formData.password,
      passwordConfirmation: formData.passwordConfirmation,
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
      email: formData.email,
      preferredLocale: formData.preferredLocale
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
    if (await user.matchPassword(formData.currentPassword)) {
      await user.update({
        password: formData.newPassword,
        passwordConfirmation: formData.passwordConfirmation
      });
    } else {
      return { currentPassword: 'Contraseña incorrecta' };
    }
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