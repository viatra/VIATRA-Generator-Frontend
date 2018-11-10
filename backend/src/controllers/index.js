const exec = require('child_process').exec;   
const fs = require('fs'); 
const path = require('path');

const helpers = require('./helpers.js');
const mongo = require('../db/mongo.js');

const LOG = 'LOG: ';
// Path to jar file
const JAR_PATH = __dirname + '/aa.jar';
// Config output specification needs to point to 'outputs/models'!!
const OUTPUT_PATH = path.resolve(path.join(__dirname, '../..', 'outputs/models'));

/**
 * Generates the model by executing the jar file
 * @param {string} inputPath - path to input folders
 * @param {object} collectionOutput - collection where outputs will be inserted
 * @param {string} logicalName - logical name of the inputs
 * @param {object} sendResponse - response sent from the model generation
 */
const generateModel = (inputPath, collectionOutput, logicalName, callback) => {
    exec(`java -jar ${JAR_PATH} ${inputPath}/generation.vsconfig`, (err, stdout, stderr) => {
        if(err) throw err;
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        
        // After generating the output, save them to disk
        console.log(LOG + "output is successfully generated, iterating over output...");
        
        // Save generated output to disk
        saveOutputToDisk(OUTPUT_PATH, '/viatra-storage/outputs', (destination) => {
            const payload = {
                logicalName: logicalName,
                outputPath: destination
            }
            
            // Insert the generated output into the database
            mongo.insertData(collectionOutput, payload, (result) => {
                console.log(result.ops[0]);
                callback(result.ops[0]);              
            });
        });
    })
};

/**
 * Takes a list of files and saves to specified destination.
 * @param {Array} files 
 * @param {string} destination 
 */
const saveInputToDisk = (files, destination, res) => {
    files.forEach(file => {
        const filePath = OUTPUT_PATH + '/' + file;
        const uid = helpers.generatUID();

        fs.rename(filePath, (destination + '/'+ uid + '/' + file), (err) => {
            if (err) throw err;
            console.log(LOG + "file " + file + " was successfully copied to ", destination);

            res.send({
                isComplete: true,
                message: "The input has been successfully stored under /viatra-storage/outputs"
            });
        });
    });
}

/**
 * Saves the generated output to the disk at the specified destination
 * @param {string} initialPath - initial path of the generated output
 * @param {string} destination - final path of the generated output
 * @param {function} callback 
 */
const saveOutputToDisk = (initialPath, destination, callback = null) => {
    const uid = helpers.generateUID();
    const destinationWithUid = destination + '/'+ uid;

    // move the path from project dir to disk
    fs.rename(initialPath, destinationWithUid, (err) => {
        if (err) throw err;
        console.log(LOG + initialPath + " became ", destination);

        if (callback) callback(destinationWithUid);
    });
}

module.exports = {
    generateModel,
    saveInputToDisk,
    saveOutputToDisk,
};
