const fs = require('fs');
const rimraf = require('rimraf');
const readline = require('readline');

const { 
    generateUID,
    fetchInputFiles,
    searchAndReplaceFiles,
    fetchNsURIFromMetaModel,
    parseVSConfig
} = require('../../src/controllers/helpers.js');


// const { MongoClient } = require('mongodb');
// let connection;
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

test('generateUID:: does not create duplicates', () => {
    const uids = new Array(10).fill(0).map(() => {
        return generateUID();
    });
    
    uids.forEach(id => {
        const filtered = uids.filter(el => el === id);
        expect(filtered.length).toBe(1);
    });
});

describe('file related tests', () => {
    const testDir = __dirname + "/mock_files";
    const testFiles = [
        testDir + '/file1.ecore',
        testDir + '/file2.vql',
        testDir + '/file3.xmi',
        testDir + '/file3.vsconfig'
    ]

    beforeAll(() => {
        if(!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir);
        }
    
        testFiles.map(testFile => {
            if(testFile.includes('.ecore')) 
                return fs.writeFile(testFile, 'nsURI="ns.uri.fetched"')
            else if (testFile.includes('.vsconfig')) {
                const vsconfigPath = __dirname + '/mock_vsconfig.txt';
                fs.readFile(vsconfigPath, 'utf8', (err, data) => {
                    if (err) return;
                    return fs.writeFile(testFile, data)
                }); 
            }
            return fs.writeFile(testFile, 'some text');
        });

        return Promise.all(testFiles);
    });

    afterAll(() => {
        rimraf.sync(testDir);
    });

    test('fetchInputFiles:: fetches all file names in given path', () => {        
        expect(fetchInputFiles(testDir))
            .resolves
            .toHaveLength(testFiles.length);
    });
    
    test('searchAndReplaceFiles:: saves the input files to the correct directories', done => {
        return searchAndReplaceFiles(testFiles[1], ['some'], ['this']).then(() => {
            fs.readFile(testFiles[1], 'utf8', (err, data) => {
                if (err) return;
                expect(data).toMatch('this');
                done();
            }); 
        });
    });

    test('fetchNsURIFromMetaModel:: fetches the content of nsURI flag', () => {
        const expectedNsURI = 'ns.uri.fetched';
        return fetchNsURIFromMetaModel(testFiles[0]).then(trimmed => {
            expect(trimmed).toBe(expectedNsURI);
        });
    });

    test('parseVSConfig:: parses a VSConfig and returns values', () => {
        const rd = readline.createInterface({
            input: fs.createReadStream(testFiles[3]),
            console: false
        });

        const expected = { 
            epackage: '/viatra-storage/domains/metamodels/FamMetamodel.ecore',
            vql: '/viatra-storage/domains/constraints/FamPatterns.vql',
            scope: { node: '5' },
            number: '5',
            runs: '1' 
        };

        return parseVSConfig(rd).then(config => {
            expect(config).toMatchObject(expected);
        });
    });
});

