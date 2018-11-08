const express = require('express');
const controller = require('../controllers/index.js');
const multer = require('multer');
const dbSetup = require('../db/main.js');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/viatra-storage/inputs')
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + Date().now);
  }
});
const upload = multer({ storage });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Viatra Generator Service - backend' });

});

router.post('/test', upload.array('test_field', 4), (req, res, next) => {
  controller.generateModel("/Users/rawadkaram/Desktop/test/configs", res);
});

module.exports = router;
