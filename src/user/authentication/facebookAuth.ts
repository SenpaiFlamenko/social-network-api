import { Request, Response, Router } from 'express';
import { getFacebookOAuthURL, getFacebookAuthToken, getFacebookUser } from '../../utils/facebookAuthorization.js';
import User from '../model.js';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../../config/index.js';

export const facebookAuth = Router();

// interface GoogleUser {
//   email: string;
//   name: string;
//   given_name?: string;
//   family_name?: string;
//   picture?: string;
// }

facebookAuth.get('/', async (req: Request, res: Response) => {
  res.redirect(getFacebookOAuthURL());
});

facebookAuth.get('/callback', async (req: Request, res: Response) => {
  try {
    const { access_token } = await getFacebookAuthToken(req.query.code as string);
    //fix this any!
    const facebookUser: any = await getFacebookUser(access_token);

    const user = await User.findOneAndUpdate(
      {
        email: facebookUser.email,
      },
      {
        $setOnInsert: {
          email: facebookUser.email,
          username: facebookUser.email.split('@')[0],
          firstName: facebookUser.first_name,
          lastName: facebookUser.last_name,
          picture: facebookUser.picture.data.url,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '15m' },
    );
    res.status(200).cookie('access_token', accessToken, { httpOnly: true }).json('Logged in!');
  } catch (error) {
    res.status(500).json(error);
  }
});
