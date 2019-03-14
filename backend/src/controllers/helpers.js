const fs = require('fs');
const fs_root = require('../../bin/config.json').fs_root;
const readline = require('readline');

const viatraStorage = {
    inputs: `${fs_root}/inputs`,
    domains: `${fs_root}/domains`,
    runs: `${fs_root}/runs`,

    metamodels: `${fs_root}/domains/metamodels`,
    constraints: `${fs_root}/domains/constraints`,
    models: `${fs_root}/domains/model`,

    configs: `${fs_root}/runs/configs`,
    outputs: `${fs_root}/runs/outputs`
}

/**
 * Generates a unique ID.
 */
const generateUID = () => {
    const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    return (S4()+S4()+"-"+S4()+"-"+S4());
};

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
};

/**
 * Saves the inputs uploaded by a user under /viatra-storage/inputs/
 * to the proper directories on the file system
 * @param {array} files : Array of length 4
 */
const saveInputFilesToDirs = (files) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(fs_root)) {
            reject(0, `${fs_root} can't be found! Make sure it is on your machine with proper 
            permissions. Check https://github.com/viatra/VIATRA-Generator-Frontend for more info.`
            );
        }

        // Create directories in FS if it doesn't already exist
        Object.keys(viatraStorage).forEach(key => {
            if (!fs.existsSync(viatraStorage[key])) {
                fs.mkdirSync(viatraStorage[key])
            }
        });

        const handleError = (err) => { if (err) reject(1, err) };
        const newPaths = {
            metamodel: undefined,
            constraint: undefined,
            model: undefined,
            config: undefined
        };

        files.forEach(file => {
            const { filename } = file;
            if (filename.includes('.ecore')) {
                newPaths.metamodel = `${viatraStorage.metamodels}/${filename}`;
                fs.rename(
                    `${viatraStorage.inputs}/${filename}`,
                    newPaths.metamodel,
                    handleError 
                );
            } else if (filename.includes('.vql')) {
                newPaths.constraint = `${viatraStorage.constraints}/${filename}`;
                fs.rename(
                    `${viatraStorage.inputs}/${filename}`,
                    newPaths.constraint,
                    handleError
                );
            } else if (filename.includes('.xmi')) {
                newPaths.model = `${viatraStorage.models}/${filename}`;
                fs.rename(
                    `${viatraStorage.inputs}/${filename}`,
                    newPaths.model,
                    handleError
                );
            } else if (filename.includes('.vsconfig')) {
                newPaths.config = `${viatraStorage.configs}/${filename}`;
                fs.rename(
                    `${viatraStorage.inputs}/${filename}`,
                    newPaths.config,
                    handleError
                );
            }
        });

        // Send back modified paths for input files
        resolve(newPaths)
    });
}

/**
 * Searches for the regex expessions given (matches)
 * and replaces the first occurence of it
 * 
 * @param {string} file 
 * @param {regex} matches 
 * @param {string} replacements 
 */
const searchAndReplaceFiles = (file, matches, replacements) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) reject(err);

            matches.forEach((match, index) => {
                data = data.replace(match, replacements[index]);
            });
          
            fs.writeFile(file, data, 'utf8', (err) => {
                if (err) reject(err);
                resolve();
            }); 
          });
    }); 
}

const fetchNsURIFromMetaModel = (file) => {
    if (!file.includes('.ecore')) {
        return;
    }

    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) reject(err);

            const nsURI = data.match(/nsURI="(.*?)\"/)[0];
            const trimmed = nsURI.substring(nsURI.indexOf('"') + 1, nsURI.length - 1);
            resolve(trimmed);
        });
    });
}

/**
 * Saves the generated output to the disk at the specified destination
 * @param {string} initialPath - initial path of the generated output
 * @param {string} destination - final path of the generated output
 * @param {function} callback 
 */
const saveOutputToDisk = (initialPath) => {
    const { outputs } = viatraStorage;

    return new Promise((resolve, reject) => {
        const outputFile = `${outputs}/${generateUID()}.xmi`;
        // move the path from project dir to disk
        fs.rename(`${initialPath}/1.xmi`, outputFile, (err) => {
            if (err) reject(err);    
            resolve(outputFile);
        });
    });
};

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
        parseVSConfig(rd).then((config) => {
            resolve(config);
        });
    });  
};


module.exports = {
    generateUID,
    fetchInputFiles,
    saveInputFilesToDirs,
    searchAndReplaceFiles,
    fetchNsURIFromMetaModel,
    saveOutputToDisk,
    buildOutputUrls,

    parseVSConfig,
    readAndExtractVSConfig,
}
