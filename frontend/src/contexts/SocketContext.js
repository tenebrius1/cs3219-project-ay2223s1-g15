import { createContext } from 'react';
import io from 'socket.io-client';

const matchingSocket = io(`http://localhost:8080`, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 50,
  path: '/matching',
});

matchingSocket.on('connect', () => {
  console.log('connected to matching');
});

matchingSocket.on('disconnect', () => {
  console.log('disconnected from matching');
});

const codingSocket = io(`http://localhost:8080`, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 50,
  path: '/coding',
});

codingSocket.on('connect', () => {
  console.log('connected to coding');
});

codingSocket.on('disconnect', () => {
  console.log('disconnected from coding');
});

const SocketContext = createContext({
  matchingSocket: matchingSocket,
  codingSocket: codingSocket,
});

export default SocketContext;
