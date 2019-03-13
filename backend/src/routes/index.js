const express = require('express');
const child_process = require('child_process');
const fs = require('fs');
const multer = require('multer');

const controller = require('../controllers/modelGeneration.js');
const fetchers = require('../controllers/fetchers.js');
const enums = require('../enums.js');
const mongo = require('../db/mongo.js');

const router = express.Router();
const helpers = require('../controllers/helpers.js');

const LOG = 'LOG: ';

/**
 * Multer input storage setup
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // TODO: direct each type of file to it's own path
    cb(null, '/viatra-storage/inputs/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });


/**
 * ROUTE for root page
 */
router.get('/', function(req, res, next) {
});

/**
 * ROUTE for model generation
 * @query (string) logicalName
 */
router.post('/generate-model', upload.array('generator_inputs', 4), (req, res) => {
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

/**
 * ROUTE for fetching an output resource from mongo db
 * @query (string) logicalName
 * @query (string) file : file with extension
 */
router.get('/fetch/output/resource', (req, res) => {
  if (!req.query.logicalName) 
    res.status(400).send({ message: 'Please provide {logicalName} query params' });

  const query = {
    logicalName: req.query.logicalName
  }
  mongo.findOne(req.app.locals.collectionOutput, query).then(result => {
    const file = req.query.file;
    if (file) {
      const filePath = result.path + '/' + file;
      if (fs.existsSync(filePath)) {
        // download the file if found
        res.download(filePath);
      } else {
        res.status(404).send(
          'Specified file cannot be found on disk. Make sure to specify the full name of the file'
        );
      }
    } else {
      const zip = 'output.zip';
      child_process.exec(`zip -r ${zip} ${result.path}`, { cwd: result.path }, (err) => {
        if (err) throw err;
        res.download(result.path + '/' + zip)
      });
    }
    
  }).catch(err => { res.status(404).send('Specified logical name cannot be found.') });
});

/**
 * ROUTE for fetching all .ecore files stored on the file system
 */
router.get('/fetch-ecores', (req, res) => {
  fetchers.fetchInputFiles('/viatra-storage/inputs/').then(inputs => {
    res.send(
      inputs.filter(input => input.files.length > 0)
      .map(input => ({
        dir: `/viatra-storage/inputs/${input.dir}`,
        files: input.files.filter(file => file.includes('.ecore'))[0]
      }))
    );
  }).catch(err => res.status(404).send(err));
})

/**
 * ROUTE for fetching config given a .ecore file
 * @query (string) id : unique id of directory
 */
router.get('/fetch-config', (req, res) => {
  if(!req.query.id) {
    res.status(400).send({ error: '{id} query param not specified' });
  }

  const fullpath = `/viatra-storage/inputs/${req.query.id}`;
  fs.readdir(fullpath, (err, files)=> {
    const vsconfig = files.filter((file) => file.includes('.vsconfig'));
    if(vsconfig.length === 0) {
      res.status(400).send({ 
        error: '.vsconfig file could not be found! Make sure you are passing the correct directory'
      });
    }
    const vsconfigPath = `${fullpath}/${vsconfig[0]}`;

    fetchers.readAndExtractVSConfig(vsconfigPath).then(config => {
      res.status(200).send(config);
    });
  })
  // fetchers.readFile(fullpath);
})

module.exports = router;
