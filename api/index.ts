// api/index.ts - For Vercel serverless deployment
import { Request, Response } from 'express';
import connectDB from '../src/config/db.config';
import app from '../src/app';

let isConnected = false;

const connectOnce = async () => {
  if (!isConnected) {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await connectDB(MONGO_URI);
    isConnected = true;
    console.log('✅ Database connected in serverless function');
  }
};

export default async (req: Request, res: Response) => {
  try {
    console.log(`📝 ${req.method} ${req.url}`);
    
    await connectOnce();
    
    // Let Express handle the request - it has CORS configured
    return app(req, res);
  } catch (error) {
    const err = error as Error;
    console.error('❌ Serverless function error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
      timestamp: new Date().toISOString()
    });
  }
};