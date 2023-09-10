import { NextFunction, Response } from 'express';
import User from '../model.js';
import { AuthenticatedRequest } from '../../middleware/tokenValidation.js';
import { AppError, ErrorCode } from '../../utils/errors/errorHandling.js';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const currentUser = await User.findById(req.user.id);
    //temporal solution(until token refresh implementation)
    if (!currentUser) {
      return res.status(403).json(`Please log in!`);
    }
    const requestedUser = await User.findById(req.params.id);
    if (!requestedUser) {
      throw new AppError(`User does not exist!`, ErrorCode.notFound);
    }
    if (currentUser.friends.includes(requestedUser.id)) {
      await currentUser.updateOne({ $pull: { friends: requestedUser.id } });
      await requestedUser.updateOne({ $pull: { friends: requestedUser.id } });
      return res.status(200).json('Friend removed!');
    } else {
      throw new AppError('You are not friends with this user!', ErrorCode.forbidden);
    }
  } catch (err) {
    next(err);
  }
};
