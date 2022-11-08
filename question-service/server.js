import express from "express";
import cors from "cors";
import { createServer } from "http";

const app = express();
var PORT = process.env.PORT || 8004;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
); // config cors so that front-end can use
app.options("*", cors());
import {
  createNewQuestion,
  getRandomQuestion,
} from "./controller/question-controller.js";

app.get("/question", (req, res) =>
  res.send("hello world from question service")
);
app.get("/question/randomQuestion", getRandomQuestion);
app.post("/question", createNewQuestion);

export const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
