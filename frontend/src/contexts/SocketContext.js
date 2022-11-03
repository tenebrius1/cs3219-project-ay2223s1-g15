import { createContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext({
  matchingSocket: io('http://localhost:8001/matching').connect(`http://localhost:8080`),
  codingSocket: io('http://localhost:8002/coding').connect(`http://localhost:8080`),
});

export default SocketContext;
