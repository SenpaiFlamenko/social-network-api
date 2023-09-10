import { Response, NextFunction } from 'express';
import FriendRequest from './model.js';
import { AuthenticatedRequest } from '../../middleware/tokenValidation.js';
import { AppError, ErrorCode } from '../../utils/errors/errorHandling.js';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const pendingRequest = await FriendRequest.findOne({
      sender: req.user.id,
      recipient: req.params.id,
    });

    if (pendingRequest) {
      throw new AppError(`You already sent friend request to user ${req.params.id}!`, ErrorCode.conflict);
    }

    const newFriendRequest = new FriendRequest({ sender: req.user.id, recipient: req.params.id });
    await newFriendRequest.save();

    return res.status(200).json(`Friend request to user ${req.params.id} was sent!`);
  } catch (err) {
    next(err);
  }
};
