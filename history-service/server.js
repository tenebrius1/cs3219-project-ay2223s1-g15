import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();
var PORT = process.env.PORT || 8005;
const LIVE_URL = process.env.ENV === 'PROD' ? process.env.LIVE_URL : 'http://localhost:3000';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: `${LIVE_URL}`,
    credentials: true,
  })
); // config cors so that front-end can use
app.options('*', cors());
import { addHistory, getUserHistory } from './controller/history-controller.js';

const router = express.Router();
router.get('/', getUserHistory);
router.post('/', addHistory);

app.use('/history', router);

export const httpServer = createServer(app);

httpServer.listen(PORT, () => {});
