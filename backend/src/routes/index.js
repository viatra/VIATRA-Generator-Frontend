const express = require('express');
const router = express.Router();
const dbSetup = require('../db/main.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Viatra Generator Service - backend' });

});

router.get('/process_withconfig/:configName', function(req, res, next) {
  
  const collection = req.app.locals.collection;
  dbSetup.findOne(collection, {userName: 'rawad663'}, result => console.log(result));
  collection.find({}).toArray().then(response => res.status(200).json(response)).catch(error => console.error(error));
  // // currently just returns the config name passed in the url param
  // res.send('You gave the following config name: ' + req.params.configName); 

});

module.exports = router;
