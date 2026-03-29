import mongoose from 'mongoose';
import app from '../src/app';
import config from '../src/app/config';

// Ensure MongoDB connection is handled in a way that's compatible with Vercel's serverless environment
const connectToDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    return;
  }

  try {
    await mongoose.connect(config.db as string);
    console.log('MongoDB connected for serverless invocation');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Wrap the app with DB connection
export default async (req: any, res: any) => {
  await connectToDB();
  return app(req, res);
};
