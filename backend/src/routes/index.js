const express = require('express');
const controller = require('../controllers/index.js');
const multer = require('multer');
const mongo = require('../db/mongo.js');

const router = express.Router();
const helpers = require('../controllers/helpers.js');

/**
 * Multer input storage setup
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/viatra-storage/inputs/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });
const LOG = 'LOG: ';


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
router.post('/generateModel', upload.array('generator_inputs', 4), (req, res) => {
  console.log(LOG + req.query.logicalName);

  // save the input files under a unique ID before passing to generateModel
  helpers.saveInputFilesToDir(req.files).then(newPath => {
      console.log(LOG + `Succesfully saved inputs to ${newPath}`);

      const vsconfig = `${newPath}/generation.vsconfig`;
      helpers.searchAndReplaceFile(vsconfig, /##/g, newPath + '/').then(() => {
        console.log(LOG + `Replaced content of the file ${vsconfig}`);

        // save input data to db
        const payload = {
          logicalName: req.query.logicalName,
          path: newPath
        };
        mongo.insertData(req.app.locals.collectionInput, payload).then(result => {
          console.log(LOG + 'Inserted input in db');
          console.log()

          controller.generateModel(
              vsconfig,
              req.app.locals.collectionOutput, 
              req.query.logicalName
          ).then(outputPayload => { res.send(outputPayload); })
          .catch(err => { throw err; });
      }).catch(err => { throw err; });
    }).catch(err => { throw err; })
        
  });
});

module.exports = router;
