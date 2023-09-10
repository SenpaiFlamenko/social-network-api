import { NextFunction, Response } from 'express';
import FriendRequest from './model.js';
import User from '../model.js';
import { AuthenticatedRequest } from '../../middleware/tokenValidation.js';
import { AppError, ErrorCode } from '../../utils/errors/errorHandling.js';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const friendRequest = await FriendRequest.findOne({ sender: req.params.id, recipient: req.user.id });
    if (!friendRequest) {
      throw new AppError(
        `You haven't received friend request from user ${req.params.id} or it was canceled!`,
        ErrorCode.notFound,
      );
    }
    const currentUser = await User.findById(req.user.id);
    //temporal solution(until token refresh implementation)
    if (!currentUser) {
      return res.status(403).json(`Please log in!`);
    }
    const requestedUser = await User.findById(req.params.id);
    if (!requestedUser) {
      throw new AppError(`User does not exist!`, ErrorCode.notFound);
    }
    if (!currentUser.friends.includes(requestedUser.id)) {
      await currentUser.updateOne({ $push: { friends: requestedUser.id } });
      await requestedUser.updateOne({ $push: { friends: requestedUser.id } });
      return res.status(200).json('Friend added!');
    } else {
      throw new AppError('You are already friends with this user!', ErrorCode.conflict);
    }
  } catch (err) {
    next(err);
  }
};
