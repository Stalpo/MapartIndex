const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb://localhost:27017/your-database-name';

const connectToMongo = async () => {
  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client;
};

const getUserByUsername = async (username) => {
  const client = await connectToMongo();
  const usersCollection = client.db().collection('users');
  const user = await usersCollection.findOne({ username });
  client.close();
  return user;
};

const createUser = async ({ username, password }) => {
  const client = await connectToMongo();
  const usersCollection = client.db().collection('users');
  await usersCollection.insertOne({ username, password });
  client.close();
};

module.exports = {
  getUserByUsername,
  createUser,
};
