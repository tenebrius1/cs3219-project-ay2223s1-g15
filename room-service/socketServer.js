import { Server } from 'socket.io';

export const startSocketServer = async (httpServer) => {
  const io = new Server(httpServer, {
    // config socket.io cors so that front-end can use
    cors: {
      origin: '*',
    },
    path: '/room',
  });

  io.on('connection', (socket) => {
    console.log('a user connected to room-service');

    socket.on('matchSuccess', async ({ roomId, difficulty, role, user }) => {
      const roomName = `ROOM:${roomId}`;
      socket.join(roomName);
    });

    socket.on('sendQuestion', ({ roomId, question }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('receiveQuestion', question);
    });

    socket.on('requestSwap', ({ roomId, user }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('requestSwap', user);
    });

    socket.on('rejectRoleSwap', (roomId) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('rejectRoleSwap');
    });

    socket.on('roleSwap', async ({ roomId, user }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('roleSwap');
    });

    socket.on('endInterview', async ({ roomId, user, role }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('partnerLeft', { user, role });
      socket.leave(roomName);
    });
  });
};
