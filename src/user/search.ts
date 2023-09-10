import { Request, Response, NextFunction } from 'express';
import User from './model.js';
import { AppError, ErrorCode } from '../utils/errors/errorHandling.js';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;
    const regex = new RegExp(text);

    const users = await User.find(
      {
        $or: [
          { username: { $regex: regex, $options: 'i' } },
          { firstName: { $regex: regex, $options: 'i' } },
          { lastName: { $regex: regex, $options: 'i' } },
          { nickname: { $regex: regex, $options: 'i' } },
        ],
      },
      { password: 0, email: 0, role: 0, updatedAt: 0 },
    );
    if (!users) {
      throw new AppError(`Can't find anyone!`, ErrorCode.notFound);
    }
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
