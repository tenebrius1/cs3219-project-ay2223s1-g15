import express from "express";
import cors from "cors";
// import morgan from 'morgan';
import {
  createUser,
  deleteUser,
  passwordLogin,
  tokenLogin,
  logout,
  changePassword,
  requestPasswordReset,
  resetPassword,
  authToken,
<<<<<<< HEAD
} from "./controller/user-controller.js";
=======
  uploadImage,
  removeImage,
} from './controller/user-controller.js';
>>>>>>> 3d8ee6b168eeb967d9432f6c20f7bdd43413572e

import authenticate from "./middleware/auth.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    //replace with deployed endpoint
    origin: "http://localhost:3000",
    credentials: true,
  })
); // config cors so that front-end can use

app.options("*", cors());
// app.use(morgan('combined'));

const router = express.Router();
const authRouter = express.Router();

// Controller will contain all the User-defined Routes
<<<<<<< HEAD
router.get("/", (req, res) => res.send("Hello World from user-service"));
router.post("/", createUser);
router.post("/passwordLogin", passwordLogin);
router.post("/requestPasswordReset", requestPasswordReset);
=======
router.get('/', (req, res) => res.send('Hello World from user-service'));
router.post('/', createUser);
router.post('/passwordLogin', passwordLogin);
router.post('/tokenLogin', tokenLogin);
router.post('/requestPasswordReset', requestPasswordReset);
>>>>>>> 3d8ee6b168eeb967d9432f6c20f7bdd43413572e

// For frontend testing
router.post("/python", (req, res) => {
  console.log(req.body);
  res.send("test");
});

app.use("/user", router);

<<<<<<< HEAD
authRouter.post("/tokenLogin", tokenLogin);
authRouter.put("/changePW", changePassword);
authRouter.delete("/", deleteUser);
authRouter.delete("/logout", logout);
authRouter.post("/resetPassword", resetPassword);
=======
authRouter.put('/changePW', changePassword);
authRouter.delete('/', deleteUser);
authRouter.delete('/logout', logout);
authRouter.post('/resetPassword', resetPassword);
authRouter.post('/uploadImage', uploadImage);
authRouter.delete('/removeImage', removeImage);
>>>>>>> 3d8ee6b168eeb967d9432f6c20f7bdd43413572e

app.use("/user/auth", authenticate, authRouter);

app.get("/auth", authToken);

app.listen(8000, () => console.log("user-service listening on port 8000"));
