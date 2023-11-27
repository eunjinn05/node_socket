const { mongoclient, MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://eunjinn05:dmswls12@cluster0.mmxplba.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {});

module.exports = client;
