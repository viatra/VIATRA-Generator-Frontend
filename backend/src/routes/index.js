const express = require('express');
const router = express.Router();
const controller = require("../controllers/index.js");

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

//Doesn't work with post ? Try GET for now
router.get('/generateModel/:logicalName*', function(req,res,next){
  const inputURL = req.params.logicalName; // makeshift -- should be req.params.logicalName?
  const input2 = req.params;
  const inputURL2 = input2[Object.keys(input2)[0]];
  //var input = '/Users/musta/Downloads/test'; // local directory -- should be changed to URL/URI for general use? --WORKS
  //var inputURL = req.body.user; //another temporary -- user inputs file directory into the username position -- WORKS but no json response?
  const callback = (responseGenerated) => res.send({
    response : responseGenerated
  });
  console.log(inputURL);
  //console.log(input2[Object.keys(input2)[0]]);
  controller.generateModel('/'+inputURL+inputURL2,callback);
});

// router.get('/generateModel/:logicalName*', function(req,res,next){
//   //res.send('The following directory has been given : ' + req.params.logicalName + ' ,Model generated under backend/outputs');
//   res.sendfile("src/views/testpage.html");
//   console.log('Generator Page Get');
// });


router.get('/process_withconfig/:configName', function(req, res, next) {
  // currently just returns the config name passed in the url param
  res.send('You gave the following config name: ' + req.params.configName); 
});

module.exports = router;
