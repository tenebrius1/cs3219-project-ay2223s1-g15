import { Server } from "socket.io";
import { matchWaitingUser, deleteWaitingUser, createWaitingUser } from "../controller/match-controller";
import { httpServer } from "../index";

export const startServer = () => {
  const io = new Server(httpServer, {
    // config socket.io cors so that front-end can use
    cors: {
      origin: "*",
    },
    path: "/matching",
  });

  io.on("connection", (socket) => {
    console.log("User connected to matching-service");

    // listen to match event
    socket.on("match", async (username, difficulty) => {
      // puts user in queue and tries to match user
      console.log("match received");
      if (await createWaitingUser(username, difficulty, socket.id)) {
        const { roomId, firstUserSocketId, secondUserSocketId } = await matchWaitingUser(
          username,
        );
        if (roomId) {
          io.to(firstUserSocketId).to(secondUserSocketId).emit("matchSuccess", roomId);
        } else {
          setTimeout(() => {
            socket.emit("matchFail");
          }, 30000);
        }
      } else {
        socket.emit("Couldn't create user");
      }
    });

    // deal with cancel event before 30s timer is up
    socket.on("matchCancel", async (username) => {
      deleteWaitingUser(username);
    });

    socket.on("disconnect", () => console.log("User disconnected from matching-service"));
  });
};
