import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fileupload from 'express-fileupload';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import errorMiddleware from './v1/middlewares/error';
import v1Router from './v1/routes';
import { testDBConnection } from './v1/services/db';

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: '*',
  }),
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(fileupload());
app.use(express.static(path.join(__dirname, '../public')));


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet());
}

app.use(express.json()).use(v1Router).use(errorMiddleware);

testDBConnection();

export default app;
