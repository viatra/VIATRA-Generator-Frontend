const exec = require('child_process').exec;   
const fs = require('fs'); 
const path = require('path');

const support = require('../db/support.js');

const LOG = 'LOG: ';
// Path to jar file
const JAR_PATH = __dirname + '/aa.jar';
// Config output specification needs to point to 'outputs/models'!!
const OUTPUT_PATH = path.resolve(path.join(__dirname, '../..', 'outputs/models')); //controllers + go back + outputs/models


/**
 * Generates the model by executing the jar file
 * @param {string} inputPath - path to input folders
 * @param {object} sendResponse - response sent from the model generation
 */
const generateModel = (inputPath, res) =>
 exec(`java -jar ${JAR_PATH} ${inputPath}`, (err, stdout, stderr) => {
    if(err) throw err;
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    
    // After generating the output, save them to disk
    console.log(LOG + "output is successfully generated, iterating over output...");
    // saveOutputToDisk(OUTPUT_PATH, '/viatra-storage/outputs', res);
});

/**
 * Takes a list of files and saves to specified destination.
 * @param {Array} files 
 * @param {string} destination 
 */
const saveInputToDisk = (files, destination, res) => {
    //save files to destination/uniqueID/inputs?
    //const uniqueID
    
}

const saveOutputToDisk = (initialPath, destination, res) => {
    const uid = support.generateUID();

    // move the path from project dir to disk
    fs.rename(initialPath, (destination + '/'+ uid), (err) => {
        if (err) throw err;
        console.log(LOG + initialPath + " became ", destination);

        res.send({
            isComplete: true,
            message: "The output has been successfully stored under /viatra-storage/outputs"
        });
    });
}

module.exports = {
    generateModel,
    saveInputToDisk,
    saveOutputToDisk,
};
