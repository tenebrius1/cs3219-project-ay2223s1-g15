import { createContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext({
  matchingSocket: io("http://localhost:8080", {
    reconnection: true,
    reconnectionDelay: 1000,
    path: "/matching",
  }),
  codingSocket: io("http://localhost:8080", {
    reconnection: true,
    reconnectionDelay: 1000,
    path: "/coding",
  }),
});

export default SocketContext;
