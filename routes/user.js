const express = require('express');
const router = express.Router();
const user = require('../controllers/user.js');

router.get('/', user.getMyAccount);
router.post('/', user.updateMyAccount);
router.get('/contrasena', user.getUpdatePassword);
router.post('/contrasena', user.postUpdatePassword);

module.exports = router;
