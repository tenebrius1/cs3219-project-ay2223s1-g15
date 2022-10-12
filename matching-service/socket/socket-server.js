import { Server } from "socket.io";
import { matchWaitingUser, deleteWaitingUser } from '../controller/match-controller.js'
import { httpServer } from "../index.js";

export const startServer = () => {
  const io = new Server(httpServer, {
    // config socket.io cors so that front-end can use
    cors: {
      origin: "*"
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected');

    // listen to match event
    socket.on('match', async (username) => {
      const roomId = await matchWaitingUser(username);
      if (roomId) {
        socket.emit('matchSuccess', roomId);
      } else {
        socket.emit('matchFail');
      }
    });

    // deal with cancel event before 30s timer is up
    socket.on('matchCancel', async (username) => {
      deleteWaitingUser(username);
    });
  });
}