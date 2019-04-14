const { generateUID } = require('../../src/controllers/helpers.js');

test('generates a unique ID', () => {
    const uids = new Array(6).fill(0).map(() => {
        return generateUID();
    });
    
    uids.forEach(id => {
        const filtered = uids.filter(el => el === id);
        expect(filtered.length).toBe(1);
    });
});