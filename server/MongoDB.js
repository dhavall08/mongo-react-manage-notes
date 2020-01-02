const { MongoClient, ObjectId } = require('mongodb');
const connectionUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'NoteApp';

const initMongo = new Promise((resolve, reject) => {
  // Initialize connection once
  MongoClient.connect(`${connectionUrl}/${dbName}`, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
      console.log('Unable to connect to database.');
      reject(error);
    }
    console.log('Connected to database.');
    db = client.db(dbName);
    resolve(db);
  });
});

module.exports = {
  initMongo,
  ObjectId
}