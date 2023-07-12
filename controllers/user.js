const model = require('../db/models');

exports.show_register = (req, res, next) => {
    res.render('user/register');
}

function show_failed_register(errors, req, res, next) {
    res.render('user/register', { formData: req.body, errors: errors });
}

exports.send_register = (req, res, next) => {
    errors = {};
    console.log(req.body);
    if (errors) show_failed_register(errors, req, res, next);
}

exports.show_login = (req, res, next) => {
    res.render('user/login');
}

exports.send_login = (req, res, next) => {
    
    // ...

    res.redirect('/listas');
}