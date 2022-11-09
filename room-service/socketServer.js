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

    socket.on('matchSuccess', async ({ roomId, difficulty, role, user }) => {
      const roomName = `ROOM:${roomId}`;
      await client.hSet(roomName, 'difficulty', difficulty);
      await client.hSet(roomName, role, user);
      socket.join(roomName);
      socket.to(roomName).emit('handshake', user);
    });

    socket.on('codingPageReconnect', async ({ roomId, user }) => {
      const roomName = `ROOM:${roomId}`;
      const interviewer = await client.hGet(roomName, 'interviewer');
      const interviewee = await client.hGet(roomName, 'interviewee');
      const difficulty = await client.hGet(roomName, 'difficulty');
      if (user == interviewee || user == interviewer) {
        const userRole = user == interviewee ? 'interviewee' : 'interviewer';
        socket.join(roomName);
        socket.emit('reconnectSuccess', { role: userRole, roomId, difficulty });
        socket.to(roomName).emit('partnerReconnect');
      } else {
        socket.emit('reconnectFail', null);
      }
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
      const oldInterviewer = await client.hGet(roomName, 'interviewer');
      const oldInterviewee = await client.hGet(roomName, 'interviewee');
      if (user == oldInterviewee) {
        client.hSet(roomName, 'interviewer', user);
        client.hSet(roomName, 'interviewee', oldInterviewer);
        socket.to(roomName).emit('roleSwap', { role: 'interviewee', user });
      } else {
        client.hSet(roomName, 'interviewer', oldInterviewer);
        client.hSet(roomName, 'interviewee', user);
        socket.to(roomName).emit('roleSwap', { role: 'interviewer', user });
      }
    });

    socket.on('endInterview', async ({ roomId, user, role }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('partnerLeft', { user, role });
      const interviewer = await client.hGet(roomName, 'interviewer');
      const interviewee = await client.hGet(roomName, 'interviewee');
      if (interviewer && interviewee) {
        if (user == interviewee) {
          await client.hDel(roomName, 'interviewee');
        } else {
          await client.hDel(roomName, 'interviewer');
        }

        // await client.hSet(roomName, 'notes', notes);
      } else {
        await client.del(roomName);
      }

      socket.leave(roomName);
    });

    socket.on('initialLoad', ({ roomId, user }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('initialLoad', user);
      console.log('initial load');
    });

    socket.on('initialLoadAck', ({ roomId, isInitialLoad }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('initialLoadAck', isInitialLoad);
    });
  });
};
