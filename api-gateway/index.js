import express from 'express';
import cors from 'cors';
// import morgan from "morgan";
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import {
  userProxy,
  matchingProxy,
  codingProxy,
  videoProxy,
  questionProxy,
  historyProxy,
  roomProxy,
} from './proxy.js';
import authenticate from './middleware/auth.js';

const app = express();
const LIVE_URL =
  process.env.ENV === 'PROD' ? process.env.LIVE_URL : 'http://localhost:3000';
app.use(
  cors({
    // replace with deployed endpoint
    origin: LIVE_URL,
    credentials: true,
  })
); // config cors so that front-end can use
app.options('*', cors());
app.use(cookieParser());
// app.use(morgan('combined'));

app.use('/user', userProxy);
app.use(matchingProxy);
app.use(codingProxy);
app.use(roomProxy);

app.use('/video', authenticate, videoProxy);
app.use('/question', authenticate, questionProxy);
app.use('/history', authenticate, historyProxy);

const server = app.listen(8080, () => {
  console.log('api gateway running on port 8080');
});
