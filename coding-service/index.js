import express from 'express';
import cors from 'cors';
import http from 'http';
import { startSocketServer } from './socketServer.js';
import 'dotenv/config';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

var PORT = process.env.PORT || 8002;

const server = http.createServer(app);

app.get('/coding', (req, res) => {
  res.send('Hello World from coding-service');
});

startSocketServer(server);

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
