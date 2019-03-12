const fs = require('fs');
const readline = require('readline');
const helpers = require('./helpers.js');

/**
 * Will read the given file and extract all the
 * editable information from the .vsconfig
 * @param {string} path 
 */
const readAndExtractVSConfig = (path) => {
    const rd = readline.createInterface({
        input: fs.createReadStream(path),
        console: false
    });
    
    
    return new Promise((resolve) => {
        helpers.parseVSConfig(rd).then((config) => {
            resolve(config);
        });
    });
    
}

/**
 * Will fetch all input files uploaded on the server
 * @param {string} path 
 */
const fetchInputFiles = (path) => {
    return new Promise((resolve, reject) =>
        fs.readdir(path, (err, subDirs) => {
            if(err) reject(err);
            resolve(subDirs.map(subDir => ({
                dir: subDir,
                files: fs.readdirSync(`${path}/${subDir}`)
            })))
        })
    );
}

module.exports = {
    readAndExtractVSConfig,
    fetchInputFiles
}