import connectDB from './config/db.config';
import app from './app';
import path from 'path';
import express from 'express';


const PORT = process.env.PORT || '3000';
const MONGO_URI = process.env.MONGO_URI!;

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const startServer = async () => {
  await connectDB(MONGO_URI);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
