const { MongoClient } = require('mongodb')

module.exports.getDatabase = async function getDatabase(url) {
  const mongoClient = await MongoClient.connect(url)
  const db = await mongoClient.db()
  const collection = db.collection('poe')

  return { mongoClient, collection }
}

module.exports.insertNewEntry = async function insertNewEntry(collection, holders) {
  console.log('Connected, inserting new entry...', holders)

  const result = await collection.insert({date: new Date(), holders})

  console.log('Insert result:', JSON.stringify(result, null, 2))

}