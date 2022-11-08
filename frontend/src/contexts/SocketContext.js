import { createContext } from 'react';
import io from 'socket.io-client';
const LIVE_URL = process.env.ENV === 'PROD' ? process.env.LIVE_URL : 'http://localhost';

const matchingSocket = io(`${LIVE_URL}:8080`, {
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

const codingSocket = io(`${LIVE_URL}:8080`, {
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

const roomSocket = io(`${LIVE_URL}:8080`, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 50,
  path: '/room',
});

roomSocket.on('connect', () => {
  console.log('connected to room');
});

roomSocket.on('disconnect', () => {
  console.log('disconnected from room');
});

const SocketContext = createContext({
  matchingSocket: matchingSocket,
  codingSocket: codingSocket,
  roomSocket: roomSocket,
});

export default SocketContext;
