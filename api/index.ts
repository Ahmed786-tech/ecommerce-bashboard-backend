// api/index.ts - For Vercel serverless deployment
import { Request, Response } from 'express';
import path from 'path';
import connectDB from '../src/config/db.config';
import app from '../src/app';

// Connect to MongoDB only once per serverless function instance
let isConnected = false;
const connectOnce = async () => {
  if (!isConnected) {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await connectDB(MONGO_URI);
    isConnected = true;
    console.log('Database connected in serverless function');
  }
};

// Static file serving for uploads in serverless context
// Note: This should be configured in your app.ts, not here
// app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Serverless function handler
export default async (req: Request, res: Response) => {
  try {
    // Ensure database connection before handling any request
    await connectOnce();
    
    // Handle the request using your Express app
    return app(req as any, res as any);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};