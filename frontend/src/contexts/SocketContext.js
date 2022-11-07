import { createContext } from 'react';
import io from 'socket.io-client';

const LIVE_URL = process.env.ENV  === "PROD" ? process.env.LIVE_URL : "http://localhost";
const SocketContext = createContext({
  matchingSocket: io(`${LIVE_URL}:8080`, {
    reconnection: true,
    reconnectionDelay: 1000,
    path: '/matching',
  }),
  codingSocket: io(`${LIVE_URL}:8080`, {
    reconnection: true,
    reconnectionDelay: 1000,
    path: '/coding',
  }),
});

export default SocketContext;
