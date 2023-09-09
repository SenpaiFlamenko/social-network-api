import { mongoUri, port } from './config/index.js';
import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { router } from './router/index.js';
import errorHandling, { AppError } from './errors/errorHandling.js';

import https from 'https';
import fs from 'fs';

let key = fs.readFileSync('./tutorial.key', 'utf-8');
let cert = fs.readFileSync('./tutorial.crt', 'utf-8');
const parameters = {
  key: key,
  cert: cert,
};

const app: Express = express();

https.createServer(parameters, app);

mongoose.connect(mongoUri);
mongoose.connection.on('error', (error: Error) => console.log(error));
mongoose.connection.once('open', () => console.log('Connected to database!'));

app.use(morgan('common'));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use('/api', router);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Page ${req.originalUrl} does not exist`, 404);
  next(err);
});

app.use(errorHandling);

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
