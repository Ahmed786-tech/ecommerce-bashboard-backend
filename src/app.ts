// src/app.ts - Simplified working version
import express from 'express';
import path from 'path';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';

const app = express();

console.log('🚀 Starting app configuration...');

// Simple CORS configuration that works
const allowedOrigins = [
  'https://ecommerce-dashboard-frontend-cyan.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

// Manual CORS middleware - more reliable than cors package for complex cases

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Set CORS headers
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(204); // Respond with "No Content" for preflight requests
    return;
  }

  next(); // Proceed to the next middleware for other requests
});

console.log('✅ CORS configured');

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
console.log('✅ Static file serving configured');

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
console.log('✅ Body parser configured');

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: 'enabled'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

console.log('✅ Health check endpoints configured');

// Routes
console.log('🔍 Loading user routes...');
import userRoutes from './routes/user.routes';
app.use('/api/v1/users', userRoutes);
console.log('✅ User routes loaded');

console.log('🔍 Loading product routes...');
import productRoutes from './routes/product.routes';
app.use('/api/v1/products', productRoutes);
console.log('✅ Product routes loaded');

console.log('🔍 Loading order routes...');
import orderRoutes from './routes/order.routes';
app.use('/api/v1/orders', orderRoutes);
console.log('✅ Order routes loaded');

console.log('🔍 Loading dashboard routes...');
import dashboard from './routes/dashboard.routes';
app.use('/api/v1/dashboard', dashboard);
console.log('✅ Dashboard routes loaded');

// 404 handler for unmatched routes - NO WILDCARDS
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
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
});
console.log('✅ 404 handler configured');

// Error middleware should be last
app.use(errorHandler);
console.log('✅ Error handler configured');

console.log('🎉 App configuration complete');

export default app;