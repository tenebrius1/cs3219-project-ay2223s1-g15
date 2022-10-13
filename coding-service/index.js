import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

var PORT = process.env.PORT || 8002;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected to coding-service');

  socket.on('connectedToRoom', (roomId) => {
    const roomName = `ROOM:${roomId}`;
    socket.join(roomName);
  });

  socket.on('codeChanged', (args) => {
    const { value, roomId } = args;
    const roomName = `ROOM:${roomId}`;
    socket.in(roomName).emit('codeChanged', value);
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
