import express from 'express';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import dashboard from './routes/dashboard.routes';
import { errorHandler } from './middleware/error.middleware';

import cors from 'cors'

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'https://ecommerce-dashboard-frontend-cyan.vercel.app',
  credentials: true
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://ecommerce-dashboard-frontend-cyan.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/dashboard', dashboard);

// Error middleware should be last
app.use(errorHandler);

export default app;
