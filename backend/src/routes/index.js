var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Viatra Generator Service - backend' });
});

router.get('/process_withconfig/:configName', function(req, res, next) {
  res.send('You gave the following config name: ' + req.params.configName);
});

module.exports = router;
