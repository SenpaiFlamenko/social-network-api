import { Response, NextFunction } from 'express';
import User from './model.js';
import { AuthenticatedRequest } from '../middleware/tokenValidation.js';
import { AppError, ErrorCode } from '../utils/errors/errorHandling.js';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('You can delete only your account!', ErrorCode.forbidden);
    }
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json('Account has been deleted');
  } catch (err) {
    next(err);
  }
};
