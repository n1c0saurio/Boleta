const express = require('express');
const router = express.Router();
const user = require('../controllers/user.js');

// My account
router.get('/', user.getMyAccount);
router.post('/', user.updateMyAccount);

module.exports = router;
