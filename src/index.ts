// import connectDB from './config/db.config';
// import app from './app';
// import path from 'path';
// import express from 'express';


// const PORT = process.env.PORT || '3000';
// const MONGO_URI = process.env.MONGO_URI!;

// app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// const startServer = async () => {
//   await connectDB(MONGO_URI);

//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// };

// startServer();

import { Request, Response } from 'express';
import express from 'express';
import path from 'path';
import connectDB from '../src/config/db.config';
import app from '../src/app';

// Static file serving (Vercel only supports static from /public, but you can serve from /uploads if needed)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Connect to MongoDB only once
let isConnected = false;
const connectOnce = async () => {
  if (!isConnected) {
    await connectDB(process.env.MONGO_URI!);
    isConnected = true;
  }
};

export default async (req: Request, res: Response) => {
  await connectOnce(); // Make sure DB is connected before handling request
  return app(req as any, res as any);
};
