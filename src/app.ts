import express, { Express } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { router } from './router/index.js';
import errorHandling from './errors/errorHandling.js';
import mongoose from 'mongoose';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost/development-social-network';
mongoose.Promise = Promise;
mongoose.connect(mongoUri);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use(express.json());
app.use(morgan('common'));
app.use(helmet());

app.use('/api', router);

app.use(errorHandling);

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
