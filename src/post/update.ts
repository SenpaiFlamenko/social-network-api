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
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('You can update only your posts!', ErrorCode.forbidden);
    }
    await Post.updateOne({
      $set: req.body,
    });
    res.status(200).json('Post has been successfully updated!');
  } catch (err) {
    next(err);
  }
};
