const models = require('../db/models');

// Validate user register form
exports.RegisterForm = async (formData) => {
  try {
    let newUser = await models.User.create({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
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