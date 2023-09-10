import { Router } from 'express';
import { validateToken } from '../../middleware/tokenValidation.js';
import addFriend from './addFriend.js';
import acceptRequest from './acceptRequest.js';
import rejectRequest from './rejectRequest.js';
import removeFriend from './removeFriend.js';
import cancelRequest from './cancelRequest.js';
import receivedRequests from './receivedRequests.js';
import sentRequests from './sentRequests.js';
import friendList from './friendList.js';

export const social = Router();

//@ts-ignore
social.post('/addFriend/:id', validateToken, addFriend);

//@ts-ignore
social.post('/accept/:id', validateToken, acceptRequest);

//@ts-ignore
social.delete('/reject/:id', validateToken, rejectRequest);

//@ts-ignore
social.delete('/cancelFriendRequest/:id', validateToken, cancelRequest);

//@ts-ignore
social.delete('/removeFriend/:id', validateToken, removeFriend);

//@ts-ignore
social.get('/receivedFriendRequests', validateToken, receivedRequests);

//@ts-ignore
social.get('/sentFriendRequests', validateToken, sentRequests);

//@ts-ignore
social.get('/friends', validateToken, friendList);
