import { Router, Request, Response } from 'express';
import Post from './model.js';
import { validateToken, UserAuthInfoInRequest } from '../middleware/tokenValidation.js';

export const posts = Router();

posts.post('/', validateToken, async (req: UserAuthInfoInRequest, res: Response) => {
  try {
    const newPost = new Post({ author: req.user?.id, text: req.body.text });
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

posts.put('/:id', validateToken, async (req: UserAuthInfoInRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json(`Post does not exist!`);
    }
    if (post.author === req.user?.id || req.user?.role === 'admin') {
      await Post.updateOne({
        $set: req.body,
      });
      res.status(200).json('Post has been successfully updated!');
    } else {
      return res.status(403).json('You can update only your posts!');
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

posts.post('/:id/like', validateToken, async (req: UserAuthInfoInRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json(`Post does not exist!`);
    }
    if (!post.likes.includes(req.user?.id)) {
      await post.updateOne({ $push: { likes: req.user?.id } });
      res.status(200).json("The post has been liked! :')");
    } else {
      await post.updateOne({ $pull: { likes: req.user?.id } });
      res.status(200).json('The post has been disliked! |:^(');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

posts.delete('/:id', validateToken, async (req: UserAuthInfoInRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json(`Post does not exist!`);
    }
    if (post.author === req.user?.id || req.user?.role === 'admin') {
      await post.deleteOne();
      res.status(200).json('Account has been deleted');
    } else {
      return res.status(403).json('You can delete only your account!');
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});
