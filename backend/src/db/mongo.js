const setUpdate = (collection, query, payload) => {
    collection.update(query, { $set: { payload } })
}

/**
 * Insert specified payload into the specified collection in the database
 * 
 * @param {object} collection 
 * @param {object} payload 
 * @returns new Promise()
 */
const insertData = (collection, payload) => {
    return collection.insertOne(payload, { w:1 });
}

/**
 * Find one occurence of the query
 * 
 * @param collection 
 * @param query 
 * @returns new Promise()
 */
const findOne = (collection, query) => {
    return collection.findOne(query);
}

/**
 * Find more than one occurence of a query
 * 
 * @param collection 
 * @param query 
 * @returns new Promise()
 */
const findAll = (collection, query = null) => {
    return collection.find(query).toArray();
}

module.exports = {
    setUpdate,
    insertData,
    findOne,
    findAll
}
