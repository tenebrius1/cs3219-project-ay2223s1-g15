import {
    ormCreateUser as _createUser,
    ormFindUser as _findUser,
    ormDeleteUser as _deleteUser,
} from '../model/user-orm.js';
import { blacklist } from '../model/repository.js';
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
                process.env.JWT_TOKEN_KEY,
                { expiresIn: '10d' }
            );
            res.cookie('token', token, { httpOnly: true });

            return res.status(200).json({ token: token });
        }

        return res.status(400).json({ message: 'Invalid Credentials!' });
    } catch (err) {
        return res.status(400).json({ message: 'Login failed!' });
    }
}

export async function logout(req, res) {
    try {
        const { token } = req.cookies;
        await blacklist(token);
        res.clearCookie('token');
        return res.status(200).json({ message: 'Successfully logged out!' });
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred with logout' });
    }
}

export async function deleteUser(req, res) {
    try {
        const { username } = req.body;
        const { token } = req.cookies;
        const tokenUsername = jwt.decode(token).username;
        console.log(tokenUsername);
        // If request has a username and given username is equals to username in the JWT token
        if (username && username == tokenUsername) {
            // Delete user from user database
            const res = await _deleteUser(username);
            // Blacklist and clear JWT token
            await blacklist(token);
            res.clearCookie('token');
        } else {
            return res.status(400).json({ message: 'Unauthorized account deletion.' });
        }
        return res
            .status(200)
            .json({ message: 'Successfully deleted account ' + username });
    } catch (err) {
        return res.status(500).json({ message: 'Failure when deleting account' });
    }
}
