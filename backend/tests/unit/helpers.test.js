const fs = require('fs');
const { MongoClient } = require('mongodb');
const rimraf = require('rimraf');

const { 
    generateUID,
    fetchInputFiles
} = require('../../src/controllers/helpers.js');

let connection;

/**
 * Tests for the helpers.js file
 * This file contains functions meant
 * to manipulate files.
 */

// __ THIS IS FOR FUNCTIONS THAT NEED ACCESS TO THE DATABASE
// NOT APPLICABLE HERE
// beforeAll(async () => {
//     connection = await MongoClient.connect(global.__MONGO_URI__, { useNewUrlParser: true });
//     db = await connection.db(global.__MONGO_DB_NAME__);
// });

// afterAll(async () => {
//     await connection.close();
// });

test('generateUID does not create duplicates', () => {
    const uids = new Array(10).fill(0).map(() => {
        return generateUID();
    });
    
    uids.forEach(id => {
        const filtered = uids.filter(el => el === id);
        expect(filtered.length).toBe(1);
    });
});

test('fetchInputFiles fetches all file names in given path', async () => {
    console.log(__dirname)
    // /Users/rawadkaram/WebstormProjects/VIATRA-Generator-Frontend/backend/tests/unit
    const testDir = __dirname + "/mock_files";
    if(!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir);
    }
   
    const testFiles = [
        testDir + '/file1.txt',
        testDir + '/file2.txt',
        testDir + '/file3.txt',
    ]

    testFiles.map(testFile => {
        return fs.writeFile(testFile, '');
    });

    Promise.all(testFiles).then(() => {
        fetchInputFiles(testDir).then(files => {
            expect(files.length).toBe(testFiles.length)
        });
        rimraf.sync(testDir);
    });
});

