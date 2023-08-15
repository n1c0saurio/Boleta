const express = require('express');
const router = express.Router();
const index = require('../controllers/index.js');

// Homepage is also loggin page
router.get('/', index.getLogin);
router.post('/', index.postLogin);
router.post('/logout', index.logout);
router.get('/registro', index.getRegister);
router.post('/registro', index.postRegister);
router.get('/recuperar-contrasena', index.getResetPasswordRequest);
router.get('/recuperar-contrasena/:token', index.getResetPassword);
router.post('recuperar-contrasena/:token', index.postResetPassword);

module.exports = router;