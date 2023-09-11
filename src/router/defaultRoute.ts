import { Router, Request, Response, NextFunction } from 'express';

export const defaultRoute = Router();

defaultRoute.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('social network');
});
