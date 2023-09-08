import { Request, Response, Router } from 'express';
import { getGoogleOAuthURL, getGoogleAuthTokens, getGoogleUser } from '../../utils/googleAuthorization.js';

export const googleAuth = Router();

googleAuth.get('/', async (req: Request, res: Response) => {
  res.redirect(getGoogleOAuthURL());
});

googleAuth.get('/callback', async (req: Request, res: Response) => {
  try {
    const { id_token, access_token } = await getGoogleAuthTokens(req.query.code as string);
    console.log('Id Token:', id_token);
    console.log('Access Token:', access_token);

    const googleUser = await getGoogleUser(id_token, access_token);

    console.log(googleUser);
    res.status(200).send(googleUser);
  } catch (error) {
    res.status(500).send('Error parsing token response.');
  }
});
