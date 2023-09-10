import { Response, NextFunction } from 'express';
import Post from './model.js';
import User from '../user/model.js';
import { AuthenticatedRequest } from '../middleware/tokenValidation.js';

type Query = {
  page: number;
  limit: number;
};

//@ts-ignore
export default async (req: AuthenticatedRequest<{ query: Query }>, res: Response, next: NextFunction) => {
  try {
    const currentUser = await User.findById(req.user.id);
    //temporal solution(until token refresh implementation)
    if (!currentUser) {
      return res.status(403).json(`Please log in!`);
    }

    const { page = 1, limit = 20 } = req.query;

    const friendsPosts = await Post.find({ author: { $in: currentUser.friends } })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ CreatedAt: -1 }); //not sure if this line is necessary
    const pagesCount = await Post.countDocuments({ author: { $in: currentUser.friends } });

    return res.json({ friendsPosts, page: `${page} out of ${Math.ceil(pagesCount / limit)}` });
  } catch (err) {
    next(err);
  }
};
