import { Server } from "socket.io";
import { matchWaitingUser, deleteWaitingUser } from '../controller/match-controller.js'
import { httpServer } from "../index.js";
import { createWaitingUser } from '../controller/match-controller.js'

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
    socket.on('match', async (username, difficulty) => {
      // puts user in queue and tries to match user
      if (await createWaitingUser(username, difficulty, socket.id)) {
        const { roomId, firstUserSocketId, secondUserSocketId } = await matchWaitingUser(username);
        if (roomId) {
          io.to(firstUserSocketId).to(secondUserSocketId).emit('matchSuccess');
        } else {
          socket.emit('matchFail');
        }
      } else {
        socket.emit('Couldn\'t create user');
      }
    });

    // deal with cancel event before 30s timer is up
    socket.on('matchCancel', async (username) => {
      deleteWaitingUser(username);
    });
  });
}