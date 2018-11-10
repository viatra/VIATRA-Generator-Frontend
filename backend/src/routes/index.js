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


/**
 * ROUTE for homepage
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Viatra Generator Service - backend' });
  console.log('Homepage');
});

/**
 * ROUTE for model generation
 */
router.post('/generateModel/:logicalName', upload.array('test_field', 4), (req, res) => {
  // save the input files under a unique ID before passing to generateModel
  support.saveInputFilesToDir(req.files).then(newPath => {
      console.log(`LOG: Succesfully saved inputs to ${newPath}`);

      const vsconfig = `${newPath}/generation.vsconfig`; //path to config file after being stored
      support.searchAndReplaceFile(vsconfig, /##/g, newPath + '/').then(() => {
        console.log(`LOG: Replaced content of the file ${vsconfig}`);
        controller.generateModel(vsconfig, res);
      }).catch(err => { throw err; });
  });
});

router.post('/test', upload.array('test_field', 4), (req, res, next) => {
  //controller.generateModel("/Users/rawadkaram/Desktop/test/configs", res);
});

module.exports = router;
