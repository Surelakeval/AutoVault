import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load models
import User from './models/User';
import Car from './models/Car';

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected for seeding: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to DB:', error);
    process.exit(1);
  }
};

// Read JSON files
const demoData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../demo_data.json'), 'utf-8'));

// Import into DB
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await (User as any).deleteMany({});
    await (Car as any).deleteMany({});

    console.log('Data Cleared...');

    // Import Users first to get IDs
    const createdUsers = await (User as any).create(demoData.users);
    console.log(`${createdUsers.length} Users Imported!`);

    // Assign a seller ID to cars (using the Ramesh Seller or Admin)
    const seller = createdUsers.find((u: any) => u.role === 'admin') || createdUsers[0];
    
    const carsToImport = demoData.cars.map((car: any) => ({
      ...car,
      seller: (seller as any)._id
    }));

    await (Car as any).create(carsToImport);
    console.log(`${carsToImport.length} Cars Imported!`);

    console.log('Data Successfully Imported');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
