import express from 'express';
import cors from 'cors';
import { expressjwt } from 'express-jwt';
import { isBlacklisted } from './model/repository.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use

app.use(cookieParser());

app.options('*', cors());
import { createUser, deleteUser, login, logout } from './controller/user-controller.js';
import cookieParser from 'cookie-parser';

const router = express.Router();

const authorize = expressjwt({
    secret: process.env.JWT_TOKEN_KEY,
    getToken: (req) => req.cookies.token,
    algorithms: ['HS256'],
    isRevoked: async (req) => {
        const revokedToken = await isBlacklisted(req.cookies.token);
        return revokedToken != null;
    },
});

// Controller will contain all the User-defined Routes
router.get('/', (req, res) => res.send('Hello World from user-service'));
router.post('/', createUser);
router.post('/login', login);
router.delete('/', authorize, deleteUser);
router.delete('/logout', logout);

app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
});

app.listen(8000, () => console.log('user-service listening on port 8000'));
