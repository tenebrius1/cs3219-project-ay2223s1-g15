import express from "express";
import cors from "cors";
// import morgan from 'morgan';
import { createServer } from "http";
import { startServer } from "./socket/socket-server.js";

const app = express();
var PORT = process.env.PORT || 8001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

// app.use(morgan('combined'));

app.get("/matching", (_, res) => {
  res.send("Hello World from matching-service");
});

export const httpServer = createServer(app);
// connect socket.io to httpServer
startServer();

httpServer.listen(PORT, () => {});
