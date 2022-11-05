import express from "express";
import cors from "cors";
import { generateAccessToken } from "./controller/video-controller";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

app.get("/", (req, res) => res.send("Agora Auth Token Server"));
app.get("/rtctoken", generateAccessToken);

const port = process.env.PORT || 8003;
app.listen(port, () => console.log(`Agora Auth Token Server listening at Port ${port}`));
