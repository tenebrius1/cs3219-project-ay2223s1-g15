import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { startServer } from './socket/socket-server.js';

const app = express();
var PORT = process.env.PORT || 8001;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { createWaitingUser } from './controller/match-controller.js'

app.get('/', (_, res) => {
  res.send('Hello World from matching-service');
});
app.post('/', createWaitingUser);

export const httpServer = createServer(app);
// connect socket.io to httpServer
startServer();

httpServer.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
