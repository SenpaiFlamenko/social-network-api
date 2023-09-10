import { Response, NextFunction } from 'express';
import User from '../model.js';
import { AuthenticatedRequest } from '../../middleware/tokenValidation.js';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const currentUser = await User.findById(req.user.id);
    //temporal solution(until token refresh implementation)
    if (!currentUser) {
      return res.status(401).json(`Please log in!`);
    }
    return res.status(200).json(currentUser.friends);
  } catch (err) {
    next(err);
  }
};
