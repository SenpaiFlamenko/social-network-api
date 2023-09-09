import fetch from 'node-fetch';
import { AppError } from '../errors/errorHandling.js';
import { googleClientId, googleRedirectURL, googleSecret } from '../config/index.js';

export function getGoogleOAuthURL() {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: googleRedirectURL,
    client_id: googleClientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(
      ' ',
    ),
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export async function getGoogleAuthTokens(code: string) {
  const url = 'https://accounts.google.com/o/oauth2/token';
  const requestData = new URLSearchParams({
    code,
    client_id: googleClientId,
    client_secret: googleSecret,
    redirect_uri: googleRedirectURL,
    grant_type: 'authorization_code',
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: requestData,
  };

  const response = await fetch(url, options);

  if (response.ok) {
    //need to fix this "any" later
    const tokens: any = await response.json();
    return tokens;
  } else {
    throw new AppError('Error making token request.', 500);
  }
}

export async function getGoogleUser(id_token: string, access_token: string) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  });
  if (response.ok) {
    //need to fix this "any" later
    return response.json();
  } else {
    throw new AppError('Error making token request.', 500);
  }
}
