'use strict';

/**
 * Simplify a Sequelize validation error
 * @param   {err} err
 *          Error object threw by a validation operation 
 * @returns {errors}
 *          object with each wrong field as a key
 *          and the error message as its value
 */
exports.validationErrorProcesor = (err) => {
  const errors = {};
  if (err.name === 'SequelizeValidationError' && err.errors) {
    err.errors.forEach(error => {
      errors[error.path] = error.message;
    });
  } else {
    // TODO: Logs any other unexpected error
    console.log(err);
  }
  return errors;
}
