const mongo = require('mongodb');


/**
 * @param collection 
 * @param payload 
 */
const insertData = (collection, payload) => {
    return collection.insert(payload, {w:1}, (err, result) => {
        if (err) throw err;
        console.log(result);
    });
}

/**
 * Find one occurence of the query
 * 
 * @param collection 
 * @param query 
 * @callback (result) => any
 */
const findOne = (collection, query, callback = null) => {
    return collection.findOne(query, (err, result) => {
        if (err) throw err;
        if(callback !== null) callback(result);
    })
}

/**
 * Find more than one occurence of a query
 * 
 * @param collection 
 * @param query 
 * @callback (items) => any
 */
const findAll = (collection, query = null, callback = null) => {
    collection.find(query).toArray((err, items) => {
        if (err) throw err;
        if(callback !== null) callback(items);
    })
}

module.exports = {
    insertData: insertData,
    findOne: findOne,
    findAll: findAll
}