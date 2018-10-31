const express = require('express');
const router = express.Router();
const controller = require("../controllers/index.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Viatra Generator Service - backend' });
  console.log('Homepage');
});

//TODO : Doesn't work with post ? Try GET for now
//Tested correct directory is /Users/musta/Downloads/test
router.get('/generateModel/:logicalName*', function(req,res,next){
  const inputURL = req.params.logicalName; //this only grabs Users
  const fullURL = req.params;
  const inputURL2 = fullURL[Object.keys(fullURL)[0]]; // this grabs /musta/Downloads/test
  const callback = (responseGenerated) => res.send({
    response : responseGenerated
  });
  //hard code the '/' before 'Users' to get the final directory to be /Users/musta/Downloads/test
  controller.generateModel('/'+inputURL+inputURL2,callback);
});

router.get('/process_withconfig/:configName', function(req, res, next) {
  // currently just returns the config name passed in the url param
  res.send('You gave the following config name: ' + req.params.configName); 
});

module.exports = router;
