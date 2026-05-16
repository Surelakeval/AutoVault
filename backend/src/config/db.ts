import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('CRITICAL: MONGO_URI is not defined in process.env');
      console.log('Current Env Keys:', Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY')));
    }
    const conn = await mongoose.connect(uri as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
