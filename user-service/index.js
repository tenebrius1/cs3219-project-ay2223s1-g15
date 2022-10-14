import express from 'express';
import cors from 'cors';

const app = express();
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
); // config cors so that front-end can use

app.options('*', cors());
import {
    createUser,
    deleteUser,
    login,
    logout,
    changePassword,
    authorize,
    requestPasswordReset,
    resetPassword,
    verifyJwt,
} from './controller/user-controller.js';
import cookieParser from 'cookie-parser';

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (req, res) => res.send('Hello World from user-service'));
router.post('/', createUser);
router.post('/login', login);
router.put('/changePW', changePassword);
router.delete('/', authorize, deleteUser);
router.delete('/logout', logout);

router.post('/verifyJwt', verifyJwt);

router.post('/requestPasswordReset', requestPasswordReset);
router.post('/resetPassword', resetPassword);

// For frontend testing
router.post('/python', (req, res) => {
    console.log(req.body);
    res.send('test');
});

app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
});

app.listen(8000, () => console.log('user-service listening on port 8000'));
