const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Viatra Generator Service - backend' });
  console.log('Homepage');
});


// Gets username and password from /testpage -- currently just used for testing
router.post('/testpage' , function (req, res, next) {
  console.log("Post Requested")
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
  res.end("yes");
  
});
router.get('/testpage', function(req, res, next) {
  res.sendfile("src/views/testpage.html");  
  console.log('TestPageGet');
});

//
router.post('/generateModel/:logicalName', function(req,res,next){
  const inputURL = req.url.logicalName; // makeshift -- should be req.params.logicalName?
  //var input = 'C:\Users\musta\Downloads\test\inputs'; // local directory -- should be changed to URL/URI for general use?
  const callback = (inputURL) => res.send(
    'The following directory has been given : ' + req.url.logicalName + ' Model generated under backend/outputs'

  );
  generateModel(inputURl,callback);
});


router.get('/process_withconfig/:configName', function(req, res, next) {
  // currently just returns the config name passed in the url param
  res.send('You gave the following config name: ' + req.params.configName); 
});

module.exports = router;
