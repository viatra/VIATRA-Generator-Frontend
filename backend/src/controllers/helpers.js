const fs = require('fs');

/**
 * Generates a unique ID.
 */
const generateUID = () => {
    const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

/**
 * Saves the inputs uploaded by a user under /viatra-storage/inputs/
 * with a unique ID
 * @param {array} files
 */
const saveInputFilesToDir = (files) => {
    const pathWithUID = `/viatra-storage/inputs/${generateUID()}`;

    fs.mkdirSync(pathWithUID);
    return new Promise((resolve, reject) => {
        files.forEach(file => {
            fs.rename(
                `/viatra-storage/inputs/${file.filename}`,
                `${pathWithUID}/${file.filename}`,
                (err) => {
                    if (err) reject(err); 
                }
            );
        });

        resolve(pathWithUID)
    });
}

/**
 * Searches for regex match in a file 
 * and replaces ALL occurences of it
 * 
 * @param {string} file 
 * @param {regex} match 
 * @param {string} replacement 
 */
const searchAndReplaceFile = (file, match, replacement) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err,data) => {
            if (err) reject(err);
            const result = data.replace(match, replacement);
          
            fs.writeFile(file, result, 'utf8', (err) => {
                if (err) reject(err);
                resolve();
            });
          });
    }); 
}

/**
 * Function to build url for fetching output generated:
 * Either individual file (if provided)
 * Or complete directory
 * @param {string} dirPath 
 * @param {string} logicalName 
 */
const buildOutputUrls = (dirPath, logicalName) => {
    // 
    const route = (file = null) => (
        file 
        ? `http://localhost:8000/fetch/output/resource?logicalName=${logicalName}&file=${file}`
        : `http://localhost:8000/fetch/output/resource?logicalName=${logicalName}`
    )
        

    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) reject(err);
            const outputs = { allFiles: route() };

            files.forEach(file => {
                outputs[file] = route(file);
            });

            resolve(outputs);
        })
    });
}

/**
 * Function that will parse a given .vsconfig file and 
 * return the current (editable) values in it.
 * @param {object} rd : The reader object used to read lines of file
 */
const parseVSConfig = (rd) => {
    // Config values that will be returned to the user
    const config = {
        epackage: undefined,
        vql: undefined,
        scope: {
            node: undefined
        },
        number: undefined,
        runs: undefined
    }
    // Used to identify the correct line in the file
    const targetIdentifier = {
        epackage: '.ecore',
        vql: '.vql',
        node: '#node',
        number: 'number',
        runs: 'runs'
    }

    return new Promise((resolve, reject) => {
        // Will match each line to the values of the config file that
        // will be sent to the user, and update the config variable
        // accordingly.
        rd.on('line', (line) => {
            if (line.includes(targetIdentifier.epackage)) 
                config.epackage = line.slice(line.indexOf('"') + 1, line.length - 1);

            else if (line.includes(targetIdentifier.vql))
                config.vql = line.slice(line.indexOf('"') + 1, line.length - 1);

            else if (line.includes(targetIdentifier.node))
                config.scope.node = line.slice(line.indexOf('=') + 1, line.length).trim();

            else if (line.includes(targetIdentifier.number))
                config.number = line.slice(line.indexOf('=') + 1, line.length).trim();

            else if (line.includes(targetIdentifier.runs))
                config.runs = line.slice(line.indexOf('=') + 1, line.length).trim();
        });

        // We finished parsing the file, we can now send the result back
        rd.on('close', () => resolve(config));
    });
}


module.exports = {
    generateUID,
    saveInputFilesToDir,
    searchAndReplaceFile,
    buildOutputUrls,
    parseVSConfig
}
