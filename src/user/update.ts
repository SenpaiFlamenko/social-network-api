import { Response, NextFunction } from 'express';
import User from './model.js';
import { AuthenticatedRequest } from '../middleware/tokenValidation.js';
import { hashPassword } from '../utils/passwordHashing.js';
import { AppError, ErrorCode } from '../utils/errors/errorHandling.js';
import bcrypt from 'bcrypt';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const currentUser = await User.findById(req.user.id);
    //temporal solution(until token refresh implementation)
    if (!currentUser) {
      return res.status(403).json(`Please log in!`);
    }
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('You can update only your account!', ErrorCode.unauthorized);
    }
    if (req.body.newPassword) {
      const oldPassword = await bcrypt.compare(req.body.oldPassword, currentUser.password);
      if (!oldPassword) {
        throw new AppError('Wrong password!', ErrorCode.badRequest);
      }
      req.body.password = await hashPassword(req.body.newPassword);
    }
    await currentUser.updateOne({
      $set: req.body,
    });
    res.status(200).json('Account has been successfully updated!');
  } catch (err) {
    next(err);
  }
};
