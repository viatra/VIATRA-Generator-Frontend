/**
 * Insert specified payload into the specified collection in the database
 * 
 * @param {object} collection 
 * @param {object} payload 
 * @callback (result) => any
 */
const insertData = (collection, payload, callback = null) => {
    return collection.insertOne(payload, { w:1 }).then(result => {
        if (callback) callback(result);
    }).catch(err => { throw (err) });
}

/**
 * Find one occurence of the query
 * 
 * @param collection 
 * @param query 
 * @callback (result) => any
 */
const findOne = (collection, query, callback = null) => {
    return collection.findOne(query).then(result => {
        if (callback) callback(result);
    }).catch(err => { throw (err) });
}

/**
 * Find more than one occurence of a query
 * 
 * @param collection 
 * @param query 
 * @callback (items) => any
 */
const findAll = (collection, query = null, callback = null) => {
    collection.find(query).toArray().then(result => {
        if(callback) callback(result);
    }).catch(err => { throw (err) });
}

module.exports = {
    insertData: insertData,
    findOne: findOne,
    findAll: findAll
}