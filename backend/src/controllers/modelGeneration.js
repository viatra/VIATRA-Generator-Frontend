const exec = require('child_process').exec;   
const fs = require('fs'); 
const del = require('del');
const path = require('path');

const helpers = require('./helpers.js');

const LOG = 'LOG: ';
const JAR_PATH = __dirname + '/aa.jar';

/**
 * Generates the model by executing the jar file
 * @param {string} inputPath - path to generation.vsconfig
 * @param {object} collectionOutput - collection where outputs will be inserted
 * @param {string} logicalName - logical name of the inputs
 * @param {object} sendResponse - response sent from the model generation
 */
const generateModel = (inputPath) => {
    /**
     * Path to generated output after running jar file
    */
    const OUTPUT_PATH = path.resolve(path.join(__dirname, '../..', 'outputs'));
    const MODELS = OUTPUT_PATH + '/models';
    const { saveOutputToDisk } = helpers;

    return new Promise((resolve, reject) => {
        exec(`java -jar ${JAR_PATH} ${inputPath}`, (err, stdout, stderr) => {
            if(err) throw err;
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            
            // // Save generated output to disk
            saveOutputToDisk(MODELS).then(outputPath => {
                // delete output in project for cleanup
                del([OUTPUT_PATH + '/**']).then(paths => {
                    console.log(LOG + 'Deleted files and folders:\n', paths.join('\n'));
                });
                
                resolve(outputPath);
            }).catch(err => reject(err));
        })
    });
};



module.exports = {
    generateModel
};
