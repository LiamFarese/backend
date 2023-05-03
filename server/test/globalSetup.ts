import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';


module.exports = async function globalSetup() {
  const mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();

  // set the environment variable to use the in-memory database
  process.env.MONGO_URI = mongoUri;
};