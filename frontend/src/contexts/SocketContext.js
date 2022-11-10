import { createContext } from 'react';
import io from 'socket.io-client';
const LIVE_URL = process.env.ENV === 'PROD' ? process.env.LIVE_URL : 'http://localhost:8080';
const API_PREFIX = process.env.ENV === 'PROD' ? process.env.API_PREFIX : '';

const matchingSocket = io(`${LIVE_URL}`, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 50,
  path: `${API_PREFIX}/matching`,
});

const codingSocket = io(`${LIVE_URL}`, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 50,
  path: `${API_PREFIX}/coding`,
});

const roomSocket = io(`${LIVE_URL}`, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 50,
  path: `${API_PREFIX}/room`,
});

const SocketContext = createContext({
  matchingSocket: matchingSocket,
  codingSocket: codingSocket,
  roomSocket: roomSocket,
});

export default SocketContext;
