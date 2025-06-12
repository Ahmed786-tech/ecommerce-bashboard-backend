// api/index.ts or api/index.js depending on your setup
import { Request, Response } from 'express';
import app from '../src/app';

module.exports = (req: Request, res: Response) => {
  return app(req as any, res as any); // safe in Vercel serverless context
};
