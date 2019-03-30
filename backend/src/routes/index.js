const express = require('express');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const controller = require('../controllers/modelGeneration.js');
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
  // Validate POST body is not empty
  if (!req.files || req.files.length === 0) {
    res.status(400).send({ message: 'Files expected at {generator_inputs} field!' });
    return;
  } else if (req.files.length < 4) {
    res.status(400).send({ message: `Unexpected number of files ${req.files.length}, expected 4!` });
    return;
  }

  console.log(req.files); 

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
            runs: [
              { config, output }
            ]
          };

          mongo.insertData(req.app.locals.collection_tracker, payload);
          // Download output file
          res.download(output)
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
 * ROUTE for fetching all .ecore files stored on the file system
 */
router.get('/fetch-runs', (req, res) => {
  mongo.findAll(req.app.locals.collection_tracker).then(results => {
    // Parse data
    const parsed = results.map(result => {
      const regex = /[\w-]+\.[a-z]*/;
      const copy = { ...result };

      copy.constraint = result.constraint.match(regex)[0];
      copy.metamodel = result.metamodel.match(regex)[0];
      copy.runs = result.runs.map(el => {
        return {
          config: el.config.match(regex)[0],
          output: el.output.match(regex)[0]
        }
      })

      return copy;
    })
    

    res.status(200).send({ results: parsed });
  })
})

/**
 * ROUTE for fetching config given a .ecore file
 * @query (string) id : unique id of directory
 */
router.get('/fetch-config', (req, res) => {
  if(!req.query.fileName) {
    res.status(400).send({ error: '{fileName} query param not specified' });
  }

  const fullpath = '/viatra-storage/runs/configs/';
  // Validate presence of file
  fs.readdir(fullpath, (err, files)=> {
    const vsconfig = files.filter((file) => file.includes(req.query.fileName));
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
});

const jsonParser = bodyParser.json();
router.put('/update-config', jsonParser, (req, res) => {
  if(!req.query.config || !req.query.logicalName) {
    res.status(400).send({ error: '{config, logicalName} query params not specified' });
  }

  const { config, logicalName } = req.query;
  const originalConfig = `/viatra-storage/runs/configs/${config}`;

  helpers.copyVSConfigWithNewValues(originalConfig, req.body).then(copy => {
    console.log('Created copy, generating output.', copy);

    controller.generateModel(copy).then(output => {
      console.log('New ouput generated, updating mongo document with new run...')
      const query = {
        logicalName
      };
  
      const payload = {
        config: copy,
        output
      };

      mongo.setUpdate(req.app.locals.collection_tracker, query, { runs: payload });
      res.status(200).download(output);
    });
  }).catch(err => {
    console.log(err);
  });
})

router.get('/download-output', (req, res) => {
  if(!req.query.output) {
    res.status(400).send({ error: 'No output query param specified'});
  }
    
  res.download(`/viatra-storage/runs/outputs/${req.query.output}`);
});
 
module.exports = router;
