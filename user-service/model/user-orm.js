import {
    createUser,
    deleteUser,
    exists,
    findUser,
    blacklist,
    isBlacklisted,
} from './repository.js';
import jwt from 'jsonwebtoken';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({ username, password });
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
}

export const ormPasswordLogin = async (username, password) => {
    try {
        const user = await findUser(username);
        // If given credentials match database document
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

export async function ormDeleteUser(jwtToken, password) {
    try {
        const username = jwt.decode(jwtToken).username;
        const user = await findUser(username);

        // If user exists and the given password matches
        if (user && user.password == password) {
            // Delete user from user database
            await deleteUser(username);

            // Blacklist JWT token
            await blacklist(token);
            return username;
        } else {
            return null;
        }
    } catch (err) {
        return { err };
    }
}
