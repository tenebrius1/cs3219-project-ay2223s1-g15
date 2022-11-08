import { Server } from 'socket.io';
import { matchWaitingUser, deleteWaitingUser } from '../controller/match-controller.js';
import { httpServer } from '../index.js';
import { createWaitingUser } from '../controller/match-controller.js';

export const startServer = () => {
  const io = new Server(httpServer, {
    // config socket.io cors so that front-end can use
    cors: {
      origin: '*',
    },
    path: '/matching',
  });

  io.on('connection', (socket) => {
    console.log('User connected to matching-service');

    // listen to match event
    socket.on('match', async (username, difficulty) => {
      // puts user in queue and tries to match user
      console.log('match received');
      if (await createWaitingUser(username, difficulty, socket.id)) {
        const { roomId, firstUserSocketId, secondUserSocketId } = await matchWaitingUser(
          username
        );
        if (roomId) {
          io.to(firstUserSocketId).emit('matchSuccess', { roomId, role: 'interviewee' });
          io.to(secondUserSocketId).emit('matchSuccess', { roomId, role: 'interviewer' });
        } else {
          setTimeout(() => {
            socket.emit('matchFail');
          }, 30000);
        }
      } else {
        socket.emit("Couldn't create user");
      }
    });

    // deal with cancel event before 30s timer is up
    socket.on('matchCancel', async (username) => {
      deleteWaitingUser(username);
    });

    socket.on('disconnect', () => console.log('User disconnected from matching-service'));
  });
};
