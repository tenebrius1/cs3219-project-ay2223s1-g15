import express from 'express';
import cors from 'cors';
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
  uploadImage,
  removeImage,
} from './controller/user-controller.js';

import authenticate from './middleware/auth.js';
import cookieParser from 'cookie-parser';

const app = express();
const LIVE_URL =
  process.env.ENV === 'PROD' ? process.env.LIVE_URL : 'http://localhost:3000';
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    //replace with deployed endpoint
    origin: LIVE_URL,
    credentials: true,
  })
); // config cors so that front-end can use

app.options('*', cors());
// app.use(morgan('combined'));

const router = express.Router();
const authRouter = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (req, res) => res.send('Hello World from user-service'));
router.post('/', createUser);
router.post('/passwordLogin', passwordLogin);
router.post('/tokenLogin', tokenLogin);
router.post('/requestPasswordReset', requestPasswordReset);
router.post('/resetPassword', resetPassword);

//For api-gateway
router.get('/checkAuth', authToken);

app.use('/user', router);

authRouter.put('/changePW', changePassword);
authRouter.delete('/', deleteUser);
authRouter.delete('/logout', logout);
authRouter.post('/uploadImage', uploadImage);
authRouter.delete('/removeImage', removeImage);

app.use('/user/auth', authenticate, authRouter);

app.listen(8000, () => console.log('user-service listening on port 8000'));
