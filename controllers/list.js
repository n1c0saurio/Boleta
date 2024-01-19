const models = require('../db/models');
const listValidations = require('../validators/lists');

// Display dashboard for default workspace
exports.getListsAndItems = async (req, res, next) => {
  // TODO:
  const defaultWorkspace = await models.Workspace.findOne({
    where: {
      'userId': req.user.id,
      'isDefault': true
    },
    include: { all: true, nested: true }
  });
  res.render('lists/dashboard', {
    user: req.user,
    workspace: defaultWorkspace.id,
    lists: defaultWorkspace.Lists,
    errors: {}
  });
}

// Create a new list or item and reload the page
exports.postListOrItem = async (req, res, next) => {
  let errors = {};
  if (req.body.fromForm === 'newList') {
    errors = await listValidations.newList(req.body);
  } else if (req.body.fromForm === 'newItem') {
    errors = await listValidations.newItem(req.body);
  }
  // TODO: use render to send error (or successful) message
  res.redirect('/listas');
}

// Delete a list and reload the page
exports.deleteList = async (req, res, next) => {
  const errors = await listValidations.deleteList(req.params.list_id);
  // TODO: use render to send error (or successful) message
  res.redirect('/listas');
}

// Delete an item and reload the page
exports.deleteItem = async (req, res, next) => {
  const errors = await listValidations.deleteItem(req.params.item_id);
  // TODO: use render to send error (or successful) message
  res.redirect('/listas');
}