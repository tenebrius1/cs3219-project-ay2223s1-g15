import {
    ormCreateUser as _createUser,
    ormPasswordLogin as _passwordLogin,
    ormTokenLogin as _tokenLogin,
    ormLogout as _logout,
    ormDeleteUser as _deleteUser,
    ormChangePassword as _updatePassword,
    ormAuthorize as _authorize,
} from '../model/user-orm.js';

export const createUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (username && password && email) {
            const resp = await _createUser(email, username, password);
            if (resp.err) {
                return res.status(400).json({ message: 'Could not create a new user!' });
            } else if (!resp) {
                console.log(
                    `Failed to create new user. user with username ${username} or email ${email} already exists.`
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
                .json({ message: 'Email and/or Username and/or Password are missing!' });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Database failure when creating new user!' });
    }
};

export const login = async (req, res) => {
    try {
        const { token } = req.cookies;
        // If client has a JWT token. use token login
        if (token) {
            const username = await _tokenLogin(token);
            if (username) {
                return res.status(200).json({
                    message: 'Successfully logged in using JWT Token',
                    username: username,
                });
            } else {
                // Token is invalid. Delete token from user's cookie
                // so that they can login using username and password
                res.clearCookie();
                return res.status(400).json({
                    message: 'Invalid JWT Token. Try again using username and password',
                });
            }
        }

        // Client does not have JWT token. use username and password login
        const { username, password } = req.body;
        if (!(username && password)) {
            return res
                .status(400)
                .json({ message: 'Username and/or Password are missing!' });
        }

        const userToken = await _passwordLogin(username, password);
        if (userToken) {
            // Login is successful. store JWT token in user's cookies.
            res.cookie('token', userToken, { httpOnly: true });
            return res.status(200).json({ token: userToken });
        } else {
            return res.status(401).json({ message: 'Invalid Credentials!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Login failed!' });
    }
};

export const logout = async (req, res) => {
    try {
        const { token } = req.cookies;

        // If user has no JWT token, we can assume that they are not logged in.
        if (!token) {
            return res.status(400).json({ message: 'Currently not logged in' });
        }

        await _logout(token);
        res.clearCookie('token');

        return res.status(200).json({ message: 'Successfully logged out!' });
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred with logout' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { token } = req.cookies;

        // If user has no JWT token, we can assume that they are not logged in.
        if (!token) {
            return res.status(400).json({ message: 'Login is needed to delete account' });
        }

        const { password } = req.body;
        const username = await _deleteUser(token, password);

        if (username) {
            res.clearCookie('token');

            return res
                .status(200)
                .json({ message: 'Successfully deleted account ' + username });
        } else {
            return res.status(401).json({ message: 'Unauthorized account deletion.' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Failure when deleting account' });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { token } = req.cookies;

        // If user has no JWT token, we can assume that they are not logged in.
        if (!token) {
            return res
                .status(400)
                .json({ message: 'Login is needed to change password' });
        }

        const { currPassword, newPassword } = req.body;
        const isChanged = await _updatePassword(token, currPassword, newPassword);

        if (isChanged) {
            return res.status(200).json({ message: 'Successfully updated password' });
        } else {
            return res.status(401).json({ message: 'Unauthorized password change' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Failure when changing password' });
    }
};

export const authorize = _authorize;
