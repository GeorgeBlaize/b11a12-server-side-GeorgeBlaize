// config/db.js
import { MongoClient } from 'mongodb';

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log('MongoDB connected');
    return client.db('tourismDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;