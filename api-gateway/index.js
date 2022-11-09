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
import authenticate from './middleware/auth.js';

const app = express();
const LIVE_URL = process.env.ENV  === "PROD" ? process.env.LIVE_URL : "http://localhost:3000";
const API_PREFIX = process.env.ENV  === "PROD" ? process.env.API_PREFIX : "";

app.use(
  cors({
    // replace with deployed endpoint
    origin: LIVE_URL,
    credentials: true,
  })
); // config cors so that front-end can use
app.use(cookieParser());
app.use(morgan('combined'));

app.use(`${API_PREFIX}/user`, userProxy);
app.use(matchingProxy);
app.use(codingProxy);

app.use(`${API_PREFIX}/video`, authenticate, videoProxy);
app.use(`${API_PREFIX}/question`, authenticate, questionProxy);
app.use(`${API_PREFIX}/history`, authenticate, historyProxy);

const server = app.listen(8080, () => {
  console.log('api gateway running on port 8080');
});
