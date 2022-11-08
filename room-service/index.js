import express from 'express';
import cors from 'cors';
import http from 'http';
import redis from 'redis';
import { startSocketServer } from './socketServer.js';
import 'dotenv/config';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

var PORT = process.env.PORT || 8002;

const server = http.createServer(app);

const client = redis.createClient({
  url: `redis://${process.env.REDIS_URL}:6380`,
});
client.on('connect', () => console.log('connected to Redis'));
client.on('error', () => console.log('Error connecting to Redis'));
await client.connect();

app.get('/room', (req, res) => {
  res.send('Hello World from room-service');
});

startSocketServer(server, client);

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
