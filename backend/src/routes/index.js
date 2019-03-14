const express = require('express');
const child_process = require('child_process');
const fs = require('fs');
const multer = require('multer');

const controller = require('../controllers/modelGeneration.js');
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
  if(fs.existsSync())

  // Validate POST body is not empty
  if (!req.files || req.files.length === 0) {
    res.status(400).send({ message: 'Files expected at {generator_inputs} field!' });
    return;
  } else if (req.files.length < 4) {
    res.status(400).send({ message: `Unexpected number of files ${req.files.length}, expected 4!` });
    return;
  }

  // Save the input files under correct directories
  helpers.saveInputFilesToDirs(req.files).then(newPaths => {
    console.log(LOG + 'Succesfully saved inputs:', newPaths);
    const { metamodel, config, constraint, model } = newPaths;
    /**
     * Regex to match file names
     */
    const matchMetamodel = /"(.*?)\.ecore"/;
    const matchConstraint = /"(.*?)\.vql"/;
    const matchModel = /"(.*?)\.xmi"/;

    helpers.searchAndReplaceFiles(
      config, 
      [matchMetamodel, matchConstraint, matchModel], 
      [`"${metamodel}"`, `"${constraint}"`, `"${model}"`]
    ).then(() => {
      console.log(LOG + `Replaced content of the file ${config}`);

      controller.generateModel(config).then(output => {
        helpers.fetchNsURIFromMetaModel(metamodel).then(nsURI => {
          const payload = {
            logicalName: nsURI,
            metamodel,
            constraint,
            "0": {
              config,
              output
            }
          };

          mongo.insertData(req.app.locals.collection_tracker, payload);

        }).catch(err => { throw err; });
      }).catch(err => { throw err; });
    }).catch(err => { throw err; });
  }).catch((errCode, err) => {
    if (errCode === 0){
      res.status(400).send(err)
    }
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
  helpers.fetchInputFiles('/viatra-storage/inputs/').then(inputs => {
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

    helpers.readAndExtractVSConfig(vsconfigPath).then(config => {
      res.status(200).send(config);
    });
  });
})

module.exports = router;
