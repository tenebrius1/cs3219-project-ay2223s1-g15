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
      console.log(role);
      const roomName = `ROOM:${roomId}`;
      await client.hSet(roomName, 'difficulty', difficulty);
      await client.hSet(roomName, role, user);
      socket.join(roomName);
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
        console.log('reconnectFail');
        socket.emit('reconnectFail', null);
      }
    });

    socket.on('sendQuestion', ({ roomId, question }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('receiveQuestion', question);
    });

    socket.on('requestSwap', (roomId) => {
      const roomName = `ROOM:${roomId}`;
      console.log(roomId, 'reqswap');
      socket.to(roomName).emit('requestSwap');
    });

    socket.on('roleSwap', async ({ roomId, user, role }) => {
      const roomName = `ROOM:${roomId}`;
      const oldInterviewer = await client.hGet(roomName, 'interviewer');
      const oldInterviewee = await client.hGet(roomName, 'interviewee');
      if (role == oldInterviewee) {
        socket.emit('sendNotes');
        client.hSet(roomName, 'interviewer', user);
        client.hSet(roomName, 'interviewee', oldInterviewer);
        socket.to(roomName).emit('roleSwap', 'interviewee');
      } else {
        client.hSet(roomName, 'interviewer', oldInterviewer);
        client.hSet(roomName, 'interviewee', user);
        socket.to(roomName).emit('roleSwap', 'interviewer');
      }
    });

    socket.on('sendNotes', ({ roomId, notes }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('receiveNotes', notes);
    });

    socket.on('endInterview', async ({ roomId, notes, user, role }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('partnerLeft', { user, notes });
      const interviewer = await client.hGet(roomName, 'interviewer');
      const interviewee = await client.hGet(roomName, 'interviewee');
      if (interviewer && interviewee) {
        await client.hDel(roomName, role);
        await client.hSet(roomName, 'notes', notes);
        socket.leave(roomName);
      } else {
        await client.hGet();
      }
      client.del(roomName);
      socket.leave(roomName);
    });

    socket.on('initialLoad', (roomId) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('initialLoad');
    });

    socket.on('initialLoadAck', ({ roomId, isInitialLoad }) => {
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('initialLoadAck', isInitialLoad);
    });
  });
};
