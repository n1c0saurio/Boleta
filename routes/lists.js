const express = require('express');
const router = express.Router();
const list = require('../controllers/list');

// User dashboard
router.get('/', list.getList);
router.post('/', list.postList);

module.exports = router;
