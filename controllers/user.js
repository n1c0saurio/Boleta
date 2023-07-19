// const model = require('../db/models');
const userValidations = require('../validators/user');

exports.show_register = (req, res, next) => {
  res.render('user/register', { formData: {}, errors: {} });
}

exports.send_register = async (req, res, next) => {
  errors = await userValidations.RegisterForm(req.body);
  console.log(errors);
  if (errors) res.render(
    'user/register', { formData: req.body, errors: errors }
  );
  res.render('listas/dashboard', { firstTime: true });
}

exports.show_login = (req, res, next) => {
  
  // TODO: implement

  res.render('user/login');
}

exports.send_login = (req, res, next) => {

  // TODO: implement

  res.redirect('/listas');
}