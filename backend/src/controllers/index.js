const exec = require('child_process').exec;   
const fs = require('fs'); 
const del = require('del');
const path = require('path');

const helpers = require('./helpers.js');
const mongo = require('../db/mongo.js');

const LOG = 'LOG: ';
// Path to jar file
const JAR_PATH = __dirname + '/aa.jar';
// Config output specification needs to point to 'outputs/models'
// ./controllers + go back + outputs/models
const OUTPUT_PATH = path.resolve(path.join(__dirname, '../..', 'outputs'));
const MODELS = OUTPUT_PATH + '/models';

/**
 * Generates the model by executing the jar file
 * @param {string} inputPath - path to generation.vsconfig
 * @param {object} collectionOutput - collection where outputs will be inserted
 * @param {string} logicalName - logical name of the inputs
 * @param {object} sendResponse - response sent from the model generation
 */
const generateModel = (inputPath, collectionOutput, logicalName) => {
    return new Promise((resolve, reject) => {
        exec(`java -jar ${JAR_PATH} ${inputPath}`, (err, stdout, stderr) => {
            if(err) throw err;
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            
            // After generating the output, save them to disk
            console.log(LOG + "output is successfully generated, iterating over output...");
            
            // Save generated output to disk
            saveOutputToDisk(MODELS, '/viatra-storage/outputs').then(newPath => {
                // delete output in project for cleanup
                del([OUTPUT_PATH + '/**']).then(paths => {
                    console.log(LOG + 'Deleted files and folders:\n', paths.join('\n'));
                })

                const payload = {
                    logicalName: logicalName,
                    outputPath: newPath
                }
                
                // Insert the generated output into the database
                mongo.insertData(collectionOutput, payload).then(result => {
                    console.log('Output successfully inserted in db', result.ops[0]);
                    resolve(payload);              
                }).catch(err => { reject (err) });
            });
        })
    });
};

/**
 * Saves the generated output to the disk at the specified destination
 * @param {string} initialPath - initial path of the generated output
 * @param {string} destination - final path of the generated output
 * @param {function} callback 
 */
const saveOutputToDisk = (initialPath, destination) => {
    const uid = helpers.generateUID();
    const destinationWithUid = destination + '/'+ uid;

    return new Promise((resolve, reject) => {
        // move the path from project dir to disk
        fs.rename(initialPath, destinationWithUid, (err) => {
            if (err) reject(err);
            console.log(LOG + initialPath + " became ", destinationWithUid);
    
            resolve(destinationWithUid);
        })
    });
}

module.exports = {
    generateModel,
    saveOutputToDisk,
};
