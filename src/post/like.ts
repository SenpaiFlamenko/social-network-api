import { Response, NextFunction } from 'express';
import Post from './model.js';
import { AuthenticatedRequest } from '../middleware/tokenValidation.js';
import { AppError, ErrorCode } from '../utils/errors/errorHandling.js';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new AppError(`Post does not exist!`, ErrorCode.notFound);
    }
    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      res.status(200).json("The post has been liked! :')");
    } else {
      await post.updateOne({ $pull: { likes: req.user.id } });
      res.status(200).json('The post has been disliked! |:^(');
    }
  } catch (err) {
    next(err);
  }
};
