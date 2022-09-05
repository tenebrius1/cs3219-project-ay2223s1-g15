import {
    ormCreateUser as _createUser,
    ormFindUser as _findUser,
} from '../model/user-orm.js';
import jwt from 'jsonwebtoken';

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({ message: 'Could not create a new user!' });
            } else if (!resp) {
                console.log(
                    `Failed to create new user. user ${username} already exists.`
                );
                return res.status(409).json({
                    message:
                        'Username already exists! Please try again with a different username.',
                });
            } else {
                console.log(`Created new user ${username} successfully!`);
                return res
                    .status(201)
                    .json({ message: `Created new user ${username} successfully!` });
            }
        } else {
            return res
                .status(400)
                .json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Database failure when creating new user!' });
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!(username && password)) {
            return res
                .status(400)
                .json({ message: 'Username and/or Password are missing!' });
        }

        const user = await _findUser(username);

        if (user && user.password == password) {
            const token = jwt.sign(
                { user_id: user._id, username },
                process.env.JWT_TOKEN_KEY
            );

            return res.status(200).json({ token: token });
        }

        return res.status(400).json({ message: 'Invalid Credentials!' });
    } catch (err) {
        return res.status(400).json({ message: 'Login failed!' });
    }
}
