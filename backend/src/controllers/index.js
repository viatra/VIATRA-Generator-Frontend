const exec = require('child_process').exec;    

// Path to jar file
const JAR_PATH = __dirname + '/aa.jar';

/**
 * Generates the model by executing the jar file
 * @param {string} inputPath - path to input folders
 * @param {object} response - response sent from the model generation
 */
const generateModel = (inputPath, response) => exec(`java -jar ${JAR_PATH} ${inputPath}/configs/generation.vsconfig`,
    (error, stdout, stderr) => {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if(error !== null){
          console.log('exec error: ' + error);
        }

        // sends the output path as response
        response.send({
            pathToOutput: 'backend/outputs'
        })
    });

module.exports = {
    generateModel: generateModel
};