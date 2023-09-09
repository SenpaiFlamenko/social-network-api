import { Router, Response } from 'express';
import FriendRequest from './model.js';
import User from '../model.js';
import { validateToken, AuthenticatedRequest } from '../../middleware/tokenValidation.js';

export const social = Router();

//@ts-ignore
social.post('/addFriend/:id', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const pendingRequest = await FriendRequest.findOne({
      sender: req.user.id,
      recipient: req.params.id,
    });

    if (pendingRequest) {
      return res.status(409).json(`You already sent friend request to user ${req.params.id}!`);
    }
    const newFriendRequest = new FriendRequest({ sender: req.user.id, recipient: req.params.id });
    await newFriendRequest.save();
    return res.status(200).json(`Friend request to user ${req.params.id} was sent!`);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//@ts-ignore
social.post('/accept/:id', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const friendRequest = await FriendRequest.findOne({ sender: req.params.id, recipient: req.user.id });
    if (!friendRequest) {
      return res.status(404).json(`You haven't received friend request from user ${req.params.id} or it was canceled!`);
    }
    const currentUser = await User.findById(req.user.id);
    //temporal solution(until token refresh implementation)
    if (!currentUser) {
      return res.status(403).json(`Please log in!`);
    }
    const requestedUser = await User.findById(req.params.id);
    if (!requestedUser) {
      return res.status(404).json(`User does not exist!`);
    }
    if (!currentUser.friends.includes(requestedUser.id)) {
      await currentUser.updateOne({ $push: { friends: requestedUser.id } });
      await requestedUser.updateOne({ $push: { friends: requestedUser.id } });
      return res.status(200).json('Friend added!');
    } else {
      return res.status(403).json('You are already friends with this user!');
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//@ts-ignore
social.delete('/reject/:id', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const friendRequest = await FriendRequest.findOne({ sender: req.params.id, recipient: req.user.id });
    if (!friendRequest) {
      return res.status(404).json(`You haven't received friend request from user ${req.params.id} or it was canceled!`);
    }
    await FriendRequest.deleteOne({ friendRequest });
    return res.status(200).json(`Friend request from user ${req.params.id} has been rejected`);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//@ts-ignore
social.delete('/removeFriend/:id', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUser = await User.findById(req.user.id);
    //temporal solution(until token refresh implementation)
    if (!currentUser) {
      return res.status(403).json(`Please log in!`);
    }
    const requestedUser = await User.findById(req.params.id);
    if (!requestedUser) {
      return res.status(404).json(`User does not exist!`);
    }
    if (currentUser.friends.includes(requestedUser.id)) {
      await currentUser.updateOne({ $pull: { friends: requestedUser.id } });
      await requestedUser.updateOne({ $pull: { friends: requestedUser.id } });
      return res.status(200).json('Friend removed!');
    } else {
      return res.status(403).json('You are not friends with this user!');
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//@ts-ignore
social.delete('/cancelFriendRequest/:id', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const friendRequest = await FriendRequest.findOneAndDelete({ sender: req.user.id, recipient: req.params.id });
    if (!friendRequest) {
      return res.status(404).json(`You haven't sent friend request to user ${req.params.id} or it was declined!`);
    }
    return res.status(200).json(`Friend request to user ${req.params.id} has been canceled!`);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//@ts-ignore
social.get('/receivedFriendRequests', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const friendRequest = await FriendRequest.find({ recipient: req.user.id });
    if (!friendRequest) {
      return res.status(404).json(`No pending friend requests!`);
    }
    console.log(friendRequest);

    return res.status(200).json(friendRequest);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//@ts-ignore
social.get('/sentFriendRequests', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const friendRequest = await FriendRequest.find({ sender: req.user.id });
    if (!friendRequest) {
      return res.status(404).json(`No pending friend requests!`);
    }
    return res.status(200).json(friendRequest);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//@ts-ignore
social.get('/friends', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUser = await User.findById(req.user.id);
    //temporal solution(until token refresh implementation)
    if (!currentUser) {
      return res.status(403).json(`Please log in!`);
    }
    return res.status(200).json(currentUser.friends);
  } catch (err) {
    return res.status(500).json(err);
  }
});
