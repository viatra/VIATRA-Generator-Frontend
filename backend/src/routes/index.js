const express = require('express');
const child_process = require('child_process');
const multer = require('multer');


const controller = require('../controllers/index.js');
const enums = require('../enums');
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
 * @query (string) logicalName
 */
router.post('/generateModel', upload.array('generator_inputs', 4), (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400).send({ message: 'Files expected at {generator_inputs} field!' });
    return;
  }
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
          console.log(LOG + 'Inserted input in db', result.ops[0]);

          controller.generateModel(
              vsconfig,
              req.app.locals.collectionOutput, 
              req.query.logicalName
          ).then(output => {
              // once model generation is complete,
              // it's time to build the response for the user
              helpers.buildOutputUrls(output.path, output.logicalName).then(outputs => {
                const response = {
                  status: enums.ModelGenerationStatus.SUCCESS,
                  outputs: outputs,
                  logicalName: output.logicalName,
                  message: "Use the outputs in the browser to download them individually"
                }
                res.send(response); 
              }).catch(err => { throw err; })
          }).catch(err => { throw err; });
      }).catch(err => { throw err; });
    }).catch(err => { throw err; })
  });
});

router.get('/fetch/input/resource', (req, res) => {
  
});

/**
 * Fetches an output resource from mongo db
 * @query (string) logicalName
 * @query (string) file : file with extension
 */
router.get('/fetch/output/resource', (req, res) => {
  if (!req.query.logicalName) 
    res.status(404).send({ message: 'Please provide {logicalName} query params' });

  const query = {
    logicalName: req.query.logicalName
  }
  mongo.findOne(req.app.locals.collectionOutput, query).then(result => {
    const file = req.query.file;
    if (file) {
      const filePath = result.path + '/' + file;
      res.download(filePath);
    } else {
      const zip = 'output.zip';
      child_process.exec(`zip -r ${zip} ${result.path}`, { cwd: result.path }, (err) => {
        if (err) throw err;
        res.download(result.path + '/' + zip)
      });
    }
    
  }).catch(err => { throw err; });
});

module.exports = router;
