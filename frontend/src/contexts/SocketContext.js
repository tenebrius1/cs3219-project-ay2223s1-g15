import { createContext } from 'react';
import io from 'socket.io-client';

const LIVE_URL = process.env.REACT_APP_ENV  === "PROD" ? process.env.REACT_APP_URI_GATEWAY : "http://localhost";
const API_PREFIX = process.env.ENV  === "PROD" ? process.env.REACT_APP_API_PREFIX : "";
const SocketContext = createContext({
  matchingSocket: io(`${LIVE_URL}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    path: `${API_PREFIX}/matching`,
  }),
  codingSocket: io(`${LIVE_URL}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    path: `${API_PREFIX}/coding`,
  }),
});

export default SocketContext;
