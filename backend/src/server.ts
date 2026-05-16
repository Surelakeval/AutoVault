import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
const result = dotenv.config();
if (result.error) {
  // If no .env in CWD, try one level up or specific path
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

console.log('Environment Loaded. MONGO_URI present:', !!process.env.MONGO_URI);

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';
import { errorHandler } from './middleware/error';

// Route files
import authRoutes from './routes/authRoutes';
import carRoutes from './routes/carRoutes';
import messageRoutes from './routes/messageRoutes';
import valuationRoutes from './routes/valuationRoutes';
import contactRoutes from './routes/contactRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import testDriveRoutes from './routes/testDriveRoutes';
import orderRoutes from './routes/orderRoutes';

// Connect to database
connectDB();

const app: Application = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/valuation', valuationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/test-drives', testDriveRoutes);
app.use('/api/orders', orderRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('AutoVault API is running...');
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
