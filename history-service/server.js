import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();
var PORT = process.env.PORT || 8005;
const LIVE_URL = process.env.ENV  === "PROD" ? process.env.LIVE_URL : "http://localhost";

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { addHistory, getUserHistory } from './controller/history-controller.js'

app.get('/', getUserHistory);
app.post('/', addHistory);

export const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(`${LIVE_URL}:${PORT}`);
});
