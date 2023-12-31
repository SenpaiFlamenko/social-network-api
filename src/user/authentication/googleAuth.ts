import { NextFunction, Request, Response, Router } from 'express';
import { getGoogleOAuthURL, getGoogleAuthTokens, getGoogleUser } from '../../utils/googleAuthorization.js';
import User from '../model.js';
import { generateAccessToken } from '../../utils/sessions.js';
import { env } from '../../config/index.js';

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

googleAuth.get('/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id_token, access_token } = await getGoogleAuthTokens(req.query.code as string);
    //fix this any!
    const googleUser: any = await getGoogleUser(id_token, access_token);

    const user = await User.findOneAndUpdate(
      {
        email: googleUser.email,
      },
      {
        $setOnInsert: {
          email: googleUser.email,
          username: googleUser.email.split('@')[0],
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

    const accessToken = generateAccessToken(user.id, user.username, user.role);
    res
      .status(200)
      .cookie('access_token', accessToken, { httpOnly: true, secure: env === 'production' })
      .json('Logged in!');
  } catch (error) {
    next(error);
  }
});
