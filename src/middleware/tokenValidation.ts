import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/index.js';
import { AppError, ErrorCode } from '../utils/errors/errorHandling.js';

interface UserPayload {
  id: string;
  username: string;
  role: string;
}
export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

export const validateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      throw new AppError('User is not authorized or token is missing!', ErrorCode.unauthorized);
    }

    jwt.verify(token, jwtSecret, (err: any, user: any) => {
      if (err) {
        throw new AppError('User is not authorized!', ErrorCode.forbidden);
      }
      req.user = user;
      return next();
    });
  } catch (err) {
    next(err);
  }
};
