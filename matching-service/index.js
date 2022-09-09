import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from "socket.io";

const app = express();
var PORT = process.env.PORT || 8001;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { createWaitingUser, matchWaitingUser } from './controller/match-controller.js'

app.get('/', (_, res) => {
  res.send('Hello World from matching-service');
});
app.post('/', createWaitingUser);

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log('User connected');

  // create match event
  socket.on('match', async (username) => {
    const resp = await matchWaitingUser(username);
    if (resp) {
      // need a way to create a random room name
      socket.join('room1');
      io.to('room1').emit('matched succesfully!')
    }
    console.log('matched')
  });
});

httpServer.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
