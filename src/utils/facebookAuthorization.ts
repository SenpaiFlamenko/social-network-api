import fetch from 'node-fetch';
import { AppError } from './errors/errorHandling.js';
import { facebookClientId, facebookRedirectURL, facebookSecret } from '../config/index.js';

export function getFacebookOAuthURL() {
  const rootUrl = 'https://www.facebook.com/v17.0/dialog/oauth';

  const options = new URLSearchParams({
    redirect_uri: facebookRedirectURL,
    client_id: facebookClientId,
    response_type: 'code',
    scope: ['email', 'public_profile'].join(','),
    auth_type: 'rerequest',
    display: 'popup',
  });

  return `${rootUrl}?${options.toString()}`;
}

export async function getFacebookAuthToken(code: string) {
  /*I have absolutely no idea why this approach doesn't work */
  // const url = 'https://graph.facebook.com/v17.0/oauth/access_token';
  // const requestData = new URLSearchParams({
  //   code,
  //   client_id: facebookClientId,
  //   client_secret: facebookSecret,
  //   redirect_uri: facebookRedirectURL,
  //   grant_type: 'authorization_code',
  // });

  // const options = {
  //   method: 'GET',
  //   params: requestData,
  // };

  // const response = await fetch(url, options);
  const tokenUrl = `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${facebookClientId}&redirect_uri=${facebookRedirectURL}&client_secret=${facebookSecret}&code=${code}`;
  const response = await fetch(tokenUrl);

  if (response.ok) {
    //need to fix this "any" later
    const tokens: any = await response.json();
    return tokens;
  } else {
    throw new AppError('Error making token request.', 500);
  }
}

export async function getFacebookUser(access_token: string) {
  // const requestData = new URLSearchParams({
  //   fields: ['id', 'email', 'first_name', 'last_name'].join(','),
  //   access_token: access_token,
  // });

  // const options = {
  //   method: 'GET',
  //   params: requestData,
  // };
  // const response = await fetch(`https://graph.facebook.com/me`, options);

  const response = await fetch(
    `https://graph.facebook.com/v17.0/me?fields=id,name,first_name,last_name,picture,email&access_token=${access_token}`,
  );
  if (response.ok) {
    //need to fix this "any" later
    return response.json();
  } else {
    throw new AppError('Error making token request.', 500);
  }
}
