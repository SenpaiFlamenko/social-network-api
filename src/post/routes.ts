import { Router, Request, Response } from 'express';
import Post from './model.js';
import User from '../user/model.js';
import { validateToken, AuthenticatedRequest } from '../middleware/tokenValidation.js';

export const posts = Router();

//@ts-ignore
posts.post('/create', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const newPost = new Post({ author: req.user.id, text: req.body.text });
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

posts.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json(`Post does not exist!`);
    }
    res.status(200).json(post.toObject());
  } catch (err) {
    res.status(500).json(err);
  }
});

//@ts-ignore
posts.put('/:id', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json(`Post does not exist!`);
    }
    if (post.author !== req.user.id || req.user.role !== 'admin') {
      return res.status(403).json('You can update only your posts!');
    }
    await Post.updateOne({
      $set: req.body,
    });
    res.status(200).json('Post has been successfully updated!');
  } catch (err) {
    return res.status(500).json(err);
  }
});

//@ts-ignore
posts.post('/:id/like', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json(`Post does not exist!`);
    }
    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      res.status(200).json("The post has been liked! :')");
    } else {
      await post.updateOne({ $pull: { likes: req.user.id } });
      res.status(200).json('The post has been disliked! |:^(');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//@ts-ignore
posts.get('/timeline', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUser = await User.findById(req.user.id);

    //temporal solution(until token refresh implementation)
    if (!currentUser) {
      return res.status(403).json(`Please log in!`);
    }
    const userPosts = await Post.find({ author: currentUser.id });
    const friendsPosts = await Post.find({ author: { $in: currentUser.friends } });
    res.json(userPosts.concat(...friendsPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

//@ts-ignore
posts.delete('/:id', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json(`Post does not exist!`);
    }
    if (post.author === req.user.id || req.user.role === 'admin') {
      await post.deleteOne();
      res.status(200).json('Account has been deleted');
    } else {
      return res.status(403).json('You can delete only your account!');
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});
