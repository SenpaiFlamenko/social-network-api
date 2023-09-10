import { Response, NextFunction } from 'express';
import FriendRequest from './model.js';
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
    await FriendRequest.deleteOne({ friendRequest });
    return res.status(200).json(`Friend request from user ${req.params.id} has been rejected`);
  } catch (err) {
    next(err);
  }
};
