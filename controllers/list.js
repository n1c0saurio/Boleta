const models = require('../db/models');
const listValidations = require('../validators/lists');

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

exports.deleteList = async (req, res, next) => {
  let errors = {};
  errors = await listValidations.deleteList(req.params.list_id);
  // TODO: use render to send error (or successful) message
  res.redirect('/listas');
}

exports.deleteItem = async (req, res, next) => {
  let errors = {};
  errors = await listValidations.deleteItem(req.params.item_id);
  // TODO: use render to send error (or successful) message
  res.redirect('/listas');
}