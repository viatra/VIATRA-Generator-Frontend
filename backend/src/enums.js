/**
 * This file creates the enums used in the project
 */

const enums = {
    ModelGenerationStatus : { SUCCESS: 'success', FAILED: 'failed' }
};

Object.keys(enums).forEach(key => {
    Object.freeze(enums[key]);
});

module.exports = enums;
