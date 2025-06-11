import { Request, Response } from 'express';
import app from '../src/app';

import { createServer } from 'http';
import { parse } from 'url';

module.exports = (req: Request, res: Response) => {
  // Use Express handler
  return app(req as any, res as any);
};
