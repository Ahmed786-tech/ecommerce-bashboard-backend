// api/index.ts - For Vercel serverless deployment
import { Request, Response } from 'express';
import connectDB from '../src/config/db.config';

// Import your routes directly
import userRoutes from '../src/routes/user.routes';
import productRoutes from '../src/routes/product.routes';
import orderRoutes from '../src/routes/order.routes';
import dashboardRoutes from '../src/routes/dashboard.routes';

let isConnected = false;

const connectOnce = async () => {
  if (!isConnected) {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await connectDB(MONGO_URI);
    isConnected = true;
    console.log('✅ Database connected');
  }
};

const allowedOrigins = [
  'https://ecommerce-dashboard-frontend-cyan.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

const setCORSHeaders = (req: Request, res: Response) => {
  const origin = req.headers.origin;
  
  // Always set CORS headers
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // For testing, you can temporarily allow all origins
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]); // Default to main frontend
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
};

export default async (req: Request, res: Response) => {
  try {
    console.log(`📝 ${req.method} ${req.url} from origin: ${req.headers.origin}`);
    
    // Set CORS headers for ALL requests
    setCORSHeaders(req, res);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      console.log('✅ Handling OPTIONS preflight request');
      return res.status(200).end();
    }
    
    // Connect to database
    await connectOnce();
    
    // Parse request body for POST/PUT requests
    let body = {};
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      body = req.body || {};
    }
    
    // Health check endpoints
    if (req.url === '/' || req.url === '/health') {
      return res.status(200).json({
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        cors: 'enabled',
        origin: req.headers.origin
      });
    }
    
    // Route handling - manually route to avoid Express middleware issues
    const url = req.url || '';
    const method = req.method || 'GET';
    
    // User routes
    if (url.startsWith('/api/v1/users')) {
      const path = url.replace('/api/v1/users', '');
      
      if (path === '/login' && method === 'POST') {
        // Handle login directly or import your login controller
        return res.status(200).json({
          message: 'Login endpoint reached',
          cors: 'working',
          body: body,
          timestamp: new Date().toISOString()
        });
      }
      
      // For other user routes, you'd handle them similarly
      return res.status(404).json({ error: 'User route not found', path });
    }
    
    // Product routes
    if (url.startsWith('/api/v1/products')) {
      return res.status(200).json({
        message: 'Products endpoint reached',
        cors: 'working'
      });
    }
    
    // Order routes
    if (url.startsWith('/api/v1/orders')) {
      return res.status(200).json({
        message: 'Orders endpoint reached',
        cors: 'working'
      });
    }
    
    // Dashboard routes
    if (url.startsWith('/api/v1/dashboard')) {
      return res.status(200).json({
        message: 'Dashboard endpoint reached',
        cors: 'working'
      });
    }
    
    // 404 for unmatched routes
    return res.status(404).json({
      error: 'Route not found',
      path: url,
      method: method,
      available_routes: [
        'GET /',
        'GET /health',
        'POST /api/v1/users/login',
        '/api/v1/users/*',
        '/api/v1/products/*',
        '/api/v1/orders/*',
        '/api/v1/dashboard/*'
      ]
    });
    
  } catch (error) {
    const err = error as Error;
    console.error('❌ Serverless function error:', error);
    
    // Ensure CORS headers are set even for errors
    setCORSHeaders(req, res);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
      timestamp: new Date().toISOString()
    });
  }
};