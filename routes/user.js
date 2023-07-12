const express = require('express');
const router = express.Router();
const user = require('../controllers/user.js');

// Homepage is also loggin page
router.get('/', user.show_login);
router.post('/', user.send_login);
router.get('/registro', user.show_register);
router.post('/registro', user.send_register);

module.exports = router;
