import { NextFunction, Response } from 'express';
import FriendRequest from './model.js';
import { AuthenticatedRequest } from '../../middleware/tokenValidation.js';
import { AppError, ErrorCode } from '../../utils/errors/errorHandling.js';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const friendRequest = await FriendRequest.findOneAndDelete({ sender: req.user.id, recipient: req.params.id });
    if (!friendRequest) {
      throw new AppError(
        `You haven't sent friend request to user ${req.params.id} or it was declined!`,
        ErrorCode.notFound,
      );
    }

    return res.status(200).json(`Friend request to user ${req.params.id} has been canceled!`);
  } catch (err) {
    next(err);
  }
};
