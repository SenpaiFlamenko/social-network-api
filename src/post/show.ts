import { Request, Response, NextFunction } from 'express';
import Post from './model.js';
import { AppError, ErrorCode } from '../utils/errors/errorHandling.js';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments');
    if (!post) {
      throw new AppError(`Post does not exist!`, ErrorCode.notFound);
    }
    res.status(200).json(post.toObject());
  } catch (err) {
    next(err);
  }
};
