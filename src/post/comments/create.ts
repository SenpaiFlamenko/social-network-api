import { Response, NextFunction } from 'express';
import Comment from './model.js';
import Post from '../model.js';
import { AuthenticatedRequest } from '../../middleware/tokenValidation.js';
import { AppError, ErrorCode } from '../../utils/errors/errorHandling.js';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new AppError(`Post ${req.params.id} does not exist!`, ErrorCode.notFound);

    const newComment = new Comment({ author: req.user.id, content: req.body.content });
    const comment = await newComment.save();
    await post.updateOne({ $push: { comments: comment } });

    return res.status(200).json(`Comment to post ${req.params.id} was successfully added!`);
  } catch (err) {
    next(err);
  }
};
