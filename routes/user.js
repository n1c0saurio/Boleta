const express = require('express');
const router = express.Router();
const user = require('../controllers/user.js');

// Homepage is also loggin page
router.get('/registro', user.getRegister);
router.post('/registro', user.postRegister);
router.get('/', user.getLogin);
router.post('/', user.postLogin);
router.post('/logout', user.logout);
router.get('/mi-cuenta', user.getMyAccount);
router.post('/mi-cuenta', user.updateMyAccount);
router.get('/mi-cuenta/contrasena', user.getUpdatePassword);
router.post('/mi-cuenta/contrasena', user.postUpdatePassword);
router.get('/recuperar-contrasena', user.getResetPasswordRequest);
router.get('/recuperar-contrasena/:token', user.getResetPassword);
router.post('recuperar-contrasena/:token', user.postResetPassword);

module.exports = router;
