const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Viatra Generator Service - backend' });
});

router.get('/process_withconfig/:configName', function(req, res, next) {
  // currently just returns the config name passed in the url param
  res.send('You gave the following config name: ' + req.params.configName);
});

module.exports = router;
