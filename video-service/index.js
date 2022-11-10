import express from 'express';
import cors from 'cors';
import { generateAccessToken } from './controller/video-controller.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cors({
      //replace with deployed endpoint
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )
app.options('*', cors())

app.get('/video', (req, res) => res.send("Agora Auth Token Server"));
app.get('/video/rtctoken', generateAccessToken);

const port = process.env.PORT || 8003;
app.listen(port, () => console.log(`Agora Auth Token Server listening at Port ${port}`));