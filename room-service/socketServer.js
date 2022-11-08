import { Server } from 'socket.io';

export const startSocketServer = async (httpServer, client) => {
  const io = new Server(httpServer, {
    // config socket.io cors so that front-end can use
    cors: {
      origin: '*',
    },
    path: '/room',
  });

  io.on('connection', (socket) => {
    console.log('a user connected to room-service');

    socket.on('matchSuccess', ({ roomId, difficulty, role, username }) => {
      const roomName = `ROOM:${roomId}`;
      client.hSet(roomName, 'difficulty', difficulty);
      client.hSet(roomName, username, role);
      socket.join(roomName);
    });

    socket.on('codingReconnect', async ({ roomId, username }) => {
      const roomName = `ROOM:${roomId}`;
      const role = await client.hGet(roomName, username);
      if (role) {
        socket.join(roomName);
        socket.emit('reconnectSuccess', role);
      }
    });

    socket.on('sendQuestion', ({ roomId, question }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('receiveQuestion', question);
    });

    socket.on('requestSwap', async ({ roomId }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('requestSwap');
    });

    socket.on('roleSwap', async ({ roomId, username, role }) => {
      const roomName = `ROOM:${roomId}`;
      if (role == 'interviewer') {
        client.hSet(roomName, username, 'interviewee');
        socket.to(roomName).emit('roleSwap', 'interviewer');
      } else {
        client.hSet(roomName, username, 'interviewer');
        socket.to(roomName).emit('roleSwap', 'interviewee');
      }
    });

    socket.on('endInterview', ({ roomId, notes, username }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('endInterview', { username, notes });
      client.del(roomName);
    });
  });
};
