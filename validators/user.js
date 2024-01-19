const models = require('../db/models');
const { validationErrorProcesor } = require('./utils');

/**
 * Validate user registration data, and
 * create it if validation was successfull
 * @async
 * @param   {formData} formdata
 *          Body of a POST request with user registration data
 * @returns {undefined|errors} 
 *          If validations pass returns undefined, if not returns an object
 *          with each wrong field as a key and the error message as its value
 */
exports.registerForm = async (formData) => {
  try {
    const newUser = await models.User.create({
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
    return validationErrorProcesor(err);
  }
}

/**
 * Validate data to update an existing user, 
 * and update it if validation was successfull
 * @async
 * @param   {string} userId
 *          ID of an existing user 
 * @param   {formData} formData
 *          Body of a POST request with updated data 
 * @returns {undefined|errors} 
 *          If validations pass returns undefined, if not returns an object
 *          with each wrong field as a key and the error message as its value
 */
exports.updateMyAccount = async (id, formData) => {
  try {
    const user = await models.User.findOne({ where: { 'id': id } });
    await user.update({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      preferredLocale: formData.preferredLocale
    });
  } catch (err) {
    return validationErrorProcesor(err);
  }
}

/**
 * Validate data to update the password an existing user, 
 * and update it if validation was successfull
 * @param   {string} userId
 *          ID of an existing user
 * @param   {formData} formData
 *          Body of a POST request with updated password
 * @returns {undefined|errors} 
 *          If validations pass returns undefined, if not returns an object
 *          with each wrong field as a key and the error message as its value
 */
exports.updatePassword = async (id, formData) => {
  try {
    const user = await models.User.findOne({ where: { 'id': id } });
    if (await user.matchPassword(formData.currentPassword)) {
      await user.update({
        password: formData.newPassword,
        passwordConfirmation: formData.passwordConfirmation
      });
    } else {
      return { currentPassword: 'Contraseña incorrecta' };
    }
  } catch (err) {
    return validationErrorProcesor(err);
  }
}