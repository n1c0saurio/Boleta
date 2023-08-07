const models = require('../db/models');

exports.newList = async (formData) => {
  try {
    let { count } = await models.List.findAndCountAll({
      where: {
        workspaceId: formData.listWorkspace
      }
    });
    await models.List.create({
      name: formData.listName,
      position: count + 1,
      workspaceId: formData.listWorkspace
    });
  } catch (err) {
    let errors = {}
    if (err.errors) {
      err.errors.forEach(error => {
        console.log(`${error.path}: ${error.message}`);
        errors[error.path] = error.message;
      });
    } else {
      // TODO: log this
      console.log(err);
    }
    return errors;
  }
}