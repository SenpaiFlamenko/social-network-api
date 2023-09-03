import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UserPayload {
  user: { id: string; username: string; role: string };
}
export interface UserAuthInfoInRequest extends Request {
  user: Object;
}
const secret = process.env.JWT_SECRET || 'secret';

export const validateToken = async (req: UserAuthInfoInRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).json('User is not authorized or token is missing!');
  }
  try {
    jwt.verify(token, secret, (err: any, user: any) => {
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
