const MongoClient = require('mongodb').MongoClient;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'NoteApp';

const initMongo = (callback) => {
  // Initialize connection once
  MongoClient.connect(`${connectionUrl}/${dbName}`, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
      console.log('Unable to connect to database.');
      return callback();
    }
    console.log('Connected to database.');
    db = client.db(dbName);
    return callback(db);
  });
}

module.exports = {
  initMongo
}