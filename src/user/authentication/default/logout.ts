import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('access_token').status(200).json('Logged out!');
  } catch (err) {
    next(err);
  }
};
