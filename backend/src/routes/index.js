const express = require('express');
const controller = require('../controllers/index.js');
const multer = require('multer');
const router = express.Router();
const support = require('../db/support.js');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/viatra-storage/inputs/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Viatra Generator Service - backend' });
  console.log('Homepage');
});

router.post('/generateModel/:logicalName', upload.array('test_field', 4), (req, res, next) => {
  support.saveFilesToDir(req.files).then(newPath => {
      console.log(`LOG: Succesfully saved inputs to ${newPath}`);
      controller.generateModel(`${newPath}/generation.vsconfig`, res);
  });
});

router.post('/test', upload.array('test_field', 4), (req, res, next) => {
  //controller.generateModel("/Users/rawadkaram/Desktop/test/configs", res);
});

module.exports = router;
