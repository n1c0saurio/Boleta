var express = require('express');
var router = express.Router();

// User dashboard
router.get('/', function(req, res, next) {
  res.render('lists/dashboard', { title: 'Express' });
});

module.exports = router;
