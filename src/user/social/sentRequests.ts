import { NextFunction, Response } from 'express';
import FriendRequest from './model.js';
import { AuthenticatedRequest } from '../../middleware/tokenValidation.js';
import { AppError, ErrorCode } from '../../utils/errors/errorHandling.js';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const friendRequest = await FriendRequest.find({ sender: req.user.id });
    if (!friendRequest) {
      throw new AppError(`No pending friend requests!`, ErrorCode.notFound);
    }

    return res.status(200).json(friendRequest);
  } catch (err) {
    next(err);
  }
};
