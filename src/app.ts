// src/app.ts - Minimal version to debug step by step
import express from 'express';
import path from 'path';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';

const app = express();

console.log('🚀 Starting app configuration...');

// Static file serving - works for both local and Vercel
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
console.log('✅ Static file serving configured');

// CORS configuration
app.use(cors({
  origin: [
    'https://ecommerce-dashboard-frontend-cyan.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
console.log('✅ CORS configured');

// Handle preflight requests
app.options('/', cors());
console.log('✅ OPTIONS handler configured');

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
console.log('✅ Body parser configured');

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
console.log('✅ Health check endpoint configured');

// COMMENT OUT ALL ROUTES FIRST - Uncomment one by one to find the problematic one

// Step 1: Test with no routes first
console.log('📝 Routes are commented out for debugging');

// Uncomment these one by one to find which one causes the error:

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

// 404 handler for unmatched routes
app.use('/', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});
console.log('✅ 404 handler configured');

// Error middleware should be last
app.use(errorHandler);
console.log('✅ Error handler configured');

console.log('🎉 App configuration complete');

export default app;