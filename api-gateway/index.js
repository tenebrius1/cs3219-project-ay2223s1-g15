import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import {
  userProxy,
  matchingProxy,
  codingProxy,
  videoProxy,
  questionProxy,
  historyProxy,
} from './proxy.js';

const app = express();
app.use(
  cors({
    //replace with deployed endpoint
    origin: 'http://localhost:3000',
    credentials: true,
  })
); // config cors so that front-end can use
app.use(cookieParser());
app.use(morgan('combined'));

app.use('/user', userProxy);
app.use(matchingProxy);
app.use(codingProxy);
app.use('/video', videoProxy);
app.use('/question', questionProxy);
app.use('/history', historyProxy);

const server = app.listen(8080, () => {
  console.log('api gateway running on port 8080');
});
