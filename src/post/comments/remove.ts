import { Response, NextFunction } from 'express';
import Comment from './model.js';
import Post from '../model.js';
import { AuthenticatedRequest } from '../../middleware/tokenValidation.js';
import { AppError, ErrorCode } from '../../utils/errors/errorHandling.js';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      throw new AppError(`Comment ${req.params.id} does not exist!`, ErrorCode.notFound);
    }
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('You can delete only your comments!', ErrorCode.forbidden);
    }
    const post = await Post.findById(req.params.postId);
    if (!post) {
      throw new AppError(`Post ${req.params.id} does not exist!`, ErrorCode.notFound);
    }

    await post.updateOne({ $pull: { comments: comment.id } });
    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json(`Your comment to post ${req.params.postId} has been successfully deleted!`);
  } catch (err) {
    next(err);
  }
};
