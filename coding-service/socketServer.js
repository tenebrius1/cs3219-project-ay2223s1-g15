import { Server } from 'socket.io';
import axios from 'axios';

export const startSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    // config socket.io cors so that front-end can use
    cors: {
      origin: '*',
    },
    path: '/coding',
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
      socket.to(roomName).emit('codeChanged', value);
    });

    socket.on('languageChanged', (args) => {
      const { language, roomId } = args;
      console.log('languageChanged ', language);
      const roomName = `ROOM:${roomId}`;
      socket.to(roomName).emit('languageChanged', language);
    });

    socket.on('runCode', async (args) => {
      const judgeURL = process.env.JUDGE0_URL;
      const { code, languageId, roomId } = args;
      const roomName = `ROOM:${roomId}`;
      const base64Code = encodeBase64(code);
      const judgeConfig = getJudgeConfig(base64Code, languageId);

      await axios
        .post(`${judgeURL}/submissions/?base64_encoded=true&wait=true`, judgeConfig)
        .then((res) => {
          console.log(res.data);
          var result = '';
          if (res.data.stdout) {
            result = decodeBase64(res.data.stdout);
          } else if (res.data.stderr) {
            result = decodeBase64(res.data.stderr);
          } else if (res.data.compile_output) {
            result = decodeBase64(res.data.compile_output);
          }
          io.in(roomName).emit('runCodeResults', result);
        })
        .catch((err) => {
          console.log('err', err.response);
          io.in(roomName).emit('runCodeResults', 'Error occurred while running code');
        });
    });
  });
};

export const encodeBase64 = (data) => {
  return Buffer.from(data).toString('base64');
};
export const decodeBase64 = (data) => {
  return Buffer.from(data, 'base64').toString('ascii');
};

const getJudgeConfig = (code, languageId) => {
  return {
    source_code: code,
    language_id: languageId,
    number_of_runs: null,
    stdin: 'Judge0',
    expected_output: null,
    cpu_time_limit: 5,
    cpu_extra_time: 2,
    wall_time_limit: 10,
    memory_limit: null,
    stack_limit: null,
    max_processes_and_or_threads: null,
    enable_per_process_and_thread_time_limit: null,
    enable_per_process_and_thread_memory_limit: null,
    max_file_size: null,
    enable_network: null,
  };
};
