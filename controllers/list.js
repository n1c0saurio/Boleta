const models = require('../db/models');
const listValidations = require('../validators/lists');

exports.getList = async (req, res, next) => {
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

exports.postList = async (req, res, next) => {
  let errors = {}
  if (req.body.fromForm === 'newList') {
    errors = await listValidations.newList(req.body);
  } else if (req.body.fromForm === 'newItem') {
    errors = await listValidations.newItem(req.body);
  }
  res.redirect('/listas');
}