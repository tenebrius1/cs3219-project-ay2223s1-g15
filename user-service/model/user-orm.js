import {
    createUser,
    deleteUser,
    exists,
    findUser,
    changePassword,
    blacklist,
    isBlacklisted,
} from './repository.js';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import bcrypt from 'bcrypt';

// need to separate orm functions from repository to decouple business logic from persistence

export const ormCreateUser = async (username, password) => {
    try {
        const newUser = await createUser({ username, password });
        newUser.password = await hashPassword(newUser);
        // If user already exists, do not save in database
        const existingUser = await exists(username);
        if (existingUser) {
            return false;
        }

        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
};

export const ormPasswordLogin = async (username, password) => {
    try {
        const user = await findUser(username);

        // If given credentials match database info, sign new JWT token
        if (user && user.password == password) {
            const token = jwt.sign(
                { user_id: user._id, username },
                process.env.JWT_TOKEN_KEY,
                { expiresIn: '10d' }
            );
            return token;
        } else {
            return null;
        }
    } catch (err) {
        return { err };
    }
};

export const ormTokenLogin = async (jwtToken) => {
    try {
        // If given JWT token is not blacklisted, then verify the token
        if (!(await isBlacklisted(jwtToken))) {
            const decodedToken = jwt.verify(jwtToken, process.env.JWT_TOKEN_KEY);
            return decodedToken.username;
        } else {
            null;
        }
    } catch (err) {
        return null;
    }
};

export const ormLogout = async (jwtToken) => {
    try {
        await blacklist(jwtToken);
    } catch (err) {
        return { err };
    }
};

export const ormDeleteUser = async (jwtToken, password) => {
    try {
        // Get client's username from their JWT token and check if the user exists.
        const username = jwt.decode(jwtToken).username;
        const user = await findUser(username);

        // If user exists and the given password matches
        if (user && user.password == password) {
            await deleteUser(username);

            await blacklist(jwtToken);
            return username;
        } else {
            return null;
        }
    } catch (err) {
        return { err };
    }
};

export const ormChangePassword = async (jwtToken, currPassword, newPassword) => {
    try {
        // Get client's username from their JWT token and check if the user exists.
        const username = jwt.decode(jwtToken).username;
        const user = await findUser(username);

        // If user exists and the given password matches
        if (user && user.password == currPassword) {
            await changePassword(username, newPassword);
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return { err };
    }
};

export const ormAuthorize = expressjwt({
    secret: process.env.JWT_TOKEN_KEY,
    getToken: (req) => req.cookies.token,
    algorithms: ['HS256'],
    isRevoked: async (req) => {
        const revokedToken = await isBlacklisted(req.cookies.token);
        return revokedToken != null;
    },
});

async function hashPassword(newUser) {
    const hashed = await bcrypt.hash(newUser.password, 10);
    return hashed;
}
