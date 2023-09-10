import { Request, Response, NextFunction } from 'express';
import User from './model.js';
import { AppError, ErrorCode } from '../utils/errors/errorHandling.js';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id, { password: 0, email: 0, role: 0, updatedAt: 0 });
    if (!user) {
      throw new AppError(`User does not exist!`, ErrorCode.notFound);
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
