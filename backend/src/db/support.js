const fs = require('fs');

/**
 * Generates a unique ID.
 */
const generateUID = () => {
    const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

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

const searchAndReplaceFile = (file, match, replacement) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err,data) => {
            if (err) reject(err);
            const result = data.replace(match, replacement);
          
            fs.writeFile(file, result, 'utf8', (err) => {
                if (err) throw reject(err);
                resolve();
            });
          });
    }); 
}

module.exports = {
    generateUID,
    saveInputFilesToDir,
    searchAndReplaceFile,
}