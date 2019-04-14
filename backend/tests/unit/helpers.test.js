const { generateUID } = require('../../src/controllers/helpers.js');
const { MongoClient } = require('mongodb');

let connection;
let db;

beforeAll(async () => {
    console.log(global.__MONGO_URI__);
    connection = await MongoClient.connect(global.__MONGO_URI__, { useNewUrlParser: true });
    // db = await connection.db(global.__MONGO_DB_NAME__);
});

// afterAll(async () => {
//     await connection.close();
//     await db.close();
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

// test('', async () => {
//     const files = db.collection('runs');

//     await files.insertMany([
//         {type: 'Document'},
//         {type: 'Video'},
//         {type: 'Image'},
//         {type: 'Document'},
//         {type: 'Image'},
//         {type: 'Document'},
//     ]);

//     const topFiles = await files.find({}).toArray();

//     expect(topFiles).toEqual([
//         {_id: 'Document', count: 3},
//         {_id: 'Image', count: 2},
//         {_id: 'Video', count: 1},
//     ]);
// });

