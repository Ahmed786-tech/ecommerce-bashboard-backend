// src/index.ts - For local development only
import connectDB from './config/db.config';
import app from './app';

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI environment variable is not defined');
  process.exit(1);
}

// Note: Static file serving is already configured in app.ts
// Don't add it here to avoid duplication

const startServer = async () => {
  try {
    await connectDB(MONGO_URI);
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();