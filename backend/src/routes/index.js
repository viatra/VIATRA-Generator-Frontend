const express = require('express');
const controller = require('../controllers/index.js');
const multer = require('multer');
const router = express.Router();
const support = require('../db/support.js');

/**
 * uidGenerated = hash generated from db.support
 * returns object with object parameters uid, multer.destination and multer.filename
 * if want to get specific object parameter, pathWithUID() for uid? pathWithUID.multer.destination?
 */
const generatePathWithUID = () => {
  const pathWithUID = '/viatra-storage/inputs/' + support.generateUID();
  
  return {
    pathWithUID: pathWithUID,
    multer: {
        destination: (req, file, cb) => {
          cb(null, pathWithUID)
        },
        filename: (req, file, cb) => {
          cb(null, file.filename);
        }
      }
  };
} 

const generatedPathWithUID = generatePathWithUID();
const storage = multer.diskStorage(generatedPathWithUID.multer);

const upload = multer({ storage });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Viatra Generator Service - backend' });
  console.log('Homepage');
});

router.post('/generateModel/:logicalName', upload.array('test_field', 4), (req, res, next) =>{
  controller.generateModel(generatedPathWithUID.pathWithUID, res);
});

router.post('/test', upload.array('test_field', 4), (req, res, next) => {
  //controller.generateModel("/Users/rawadkaram/Desktop/test/configs", res);
});

module.exports = router;
