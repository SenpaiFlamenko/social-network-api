import { Request, Response, Router } from 'express';
import { getGoogleOAuthURL, getGoogleAuthTokens, getGoogleUser } from '../../utils/googleAuthorization.js';
import User from '../model.js';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../../config/index.js';

export const googleAuth = Router();

// interface GoogleUser {
//   email: string;
//   name: string;
//   given_name?: string;
//   family_name?: string;
//   picture?: string;
// }

googleAuth.get('/', async (req: Request, res: Response) => {
  res.redirect(getGoogleOAuthURL());
});

googleAuth.get('/callback', async (req: Request, res: Response) => {
  try {
    const { id_token, access_token } = await getGoogleAuthTokens(req.query.code as string);
    console.log('Id Token:', id_token);
    console.log('Access Token:', access_token);
    //fix this any!
    const googleUser: any = await getGoogleUser(id_token, access_token);

    const user = await User.findOneAndUpdate(
      {
        email: googleUser.email,
      },
      {
        $setOnInsert: {
          email: googleUser.email,
          username: googleUser.name,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          picture: googleUser.picture,
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
    res.status(500).send('Error parsing token response.');
  }
});
