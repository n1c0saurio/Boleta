const express = require('express');
const router = express.Router();
const list = require('../controllers/list');

// User dashboard
router.get('/', list.getListsAndItems);
router.post('/', list.postListOrItem);
router.get('/:list_id', list.deleteList);
router.get('/item/:item_id', list.deleteItem);

module.exports = router;
