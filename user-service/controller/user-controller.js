import {
  ormCreateUser as _createUser,
  ormPasswordLogin as _passwordLogin,
  ormTokenLogin as _tokenLogin,
  ormLogout as _logout,
  ormDeleteUser as _deleteUser,
  ormChangePassword as _updatePassword,
  ormRequestPasswordReset as _requestPasswordReset,
  ormResetPassword as _resetPassword,
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
          message: 'Username already exists! Please try again with a different username.',
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
    return res.status(500).json({ message: 'Database failure when creating new user!' });
  }
};

export const tokenLogin = async (req, res) => {
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
        res.clearCookie('token');
        return res.status(401).json({
          message: 'Invalid JWT Token. Try again using username and password',
        });
      }
    } else {
      return res.status(403).json({
        message: 'Login token does not exist.',
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Token login failed!' });
  }
};

export const passwordLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(401).json({ message: 'Username and/or Password are missing!' });
    }

    const userToken = await _passwordLogin(username, password);
    if (userToken) {
      // Login is successful. Clear previous token if exist store JWT token in user's cookies.
      res.clearCookie('token');
      res.cookie('token', userToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      return res.status(200).json({ username: username, token: userToken });
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
      return res.status(400).json({ message: 'Login is needed to change password' });
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

export const requestPasswordReset = async (req, res) => {
  try {
    const { username } = req.body;
    if (username) {
      const resp = await _requestPasswordReset(username);
      if (resp.err) {
        return res.status(500).json({ message: 'Unable to request for password reset' });
      }

      if (!resp) {
        return res.status(400).json({ message: 'Username provided does not exist' });
      }

      const { transporter, mailOptions } = resp;
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return res
            .status(500)
            .json({ message: 'Error when sending password reset email' });
        } else {
          return res.status(200).json({ message: 'Email sent: ' + info.response });
        }
      });
    } else {
      return res.status(400).json({ message: 'Username is missing' });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failure when requesting for password reset' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, username, newPassword } = req.body;
    if (token && username && newPassword) {
      const resp = await _resetPassword(token, username, newPassword);
      if (resp.err) {
        return res.status(500).json({ message: 'Unable to reset password' });
      }

      if (resp) {
        return res.status(200).json({ message: 'Password successfully reset!' });
      }
      return res.status(400).json({ message: 'Token details do not match username' });
    } else {
      return res.status(400).json({ message: 'Token/Username/newPassword is missing' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failure when resetting password' });
  }
};

export const authorize = _authorize;
