const fs = require('fs');

/**
 * Generates a unique ID.
 */
const generateUID = () => {
    const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

const saveFilesToDir = (files) => {
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

module.exports = {
    generateUID,
    saveFilesToDir
}