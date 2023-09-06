import { Router, Response } from 'express';
import Comment from './model.js';
import Post from '../model.js';
import { validateToken, AuthenticatedRequest } from '../../middleware/tokenValidation.js';

export const comments = Router();

//@ts-ignore
comments.post('/:id/newComment', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json(`Post ${req.params.id} does not exist!`);
    }
    const newComment = new Comment({ author: req.user.id, content: req.body.content });
    const comment = await newComment.save();
    await post.updateOne({ $push: { comments: comment } });
    return res.status(200).json(`Comment to post ${req.params.id} was successfully added!`);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//@ts-ignore
comments.put('/:postId/comment/:id', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json(`Comment ${req.params.id} does not exist!`);
    }
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json('You can update only your comments!');
    }
    await Comment.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    return res.status(200).json(`Your comment to post ${req.params.postId} was successfully updated!`);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//@ts-ignore
comments.delete('/:postId/comment/:id', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json(`Comment ${req.params.id} does not exist!`);
    }

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json('You can delete only your comments!');
    }
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json(`Post ${req.params.id} does not exist!`);
    }
    await post.updateOne({ $pull: { comments: comment.id } });
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json(`Your comment to post ${req.params.postId} has been successfully deleted!`);
  } catch (err) {
    return res.status(500).json(err);
  }
});
