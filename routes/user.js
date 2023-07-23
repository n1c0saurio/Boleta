const express = require('express');
const router = express.Router();
const user = require('../controllers/user.js');

// Homepage is also loggin page
router.get('/registro', user.showRegister);
router.post('/registro', user.sendRegister);
router.get('/', user.showLogin);
router.post('/', user.sendLogin);
router.post('/logout', user.logout);
router.get('/mi-cuenta', user.showMyAccount);
router.post('/mi-cuenta', user.updateMyAccount);

module.exports = router;
