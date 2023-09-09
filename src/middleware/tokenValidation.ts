import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/index.js';

interface UserPayload {
  id: string;
  username: string;
  role: string;
}
export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

export const validateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).json('User is not authorized or token is missing!');
  }
  try {
    jwt.verify(token, jwtSecret, (err: any, user: any) => {
      if (err) {
        return res.status(403).json('User is not authorized!');
      }
      req.user = user;
      return next();
    });
  } catch {
    return res.sendStatus(403);
  }
};
