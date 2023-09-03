import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { router } from './router/index.js';
import errorHandling, { CustomError } from './errors/errorHandling.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost/development-social-network';
mongoose.Promise = Promise;
mongoose.connect(mongoUri);
mongoose.connection.on('error', (error: Error) => console.log(error));
mongoose.connection.once('open', () => console.log('Connected to database!'));

app.use(morgan('common'));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use('/api', router);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError(`Page ${req.originalUrl} does not exist`, 404);
  next(err);
});

app.use(errorHandling);

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
