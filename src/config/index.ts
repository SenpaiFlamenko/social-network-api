import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT || 3000;

export const mongoUri = process.env.MONGO_URI || 'mongodb://localhost/development-social-network';

export const jwtSecret = process.env.JWT_SECRET || 'secret';

export const googleClientId = process.env.GOOGLE_CLIENT_ID as string;

export const googleSecret = process.env.GOOGLE_CLIENT_SECRET as string;

export const googleRedirectURL = process.env.GOOGLE_OAUTH_REDIRECT_URL as string;
