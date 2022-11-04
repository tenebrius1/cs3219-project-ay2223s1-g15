import {
  ormCreateUser as _createUser,
  ormPasswordLogin as _passwordLogin,
  ormTokenLogin as _tokenLogin,
  ormLogout as _logout,
  ormDeleteUser as _deleteUser,
  ormChangePassword as _updatePassword,
  ormRequestPasswordReset as _requestPasswordReset,
  ormResetPassword as _resetPassword,
  ormAuthToken as _authToken,
  ormUploadImage as _uploadImage,
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
    if (token) {
      const { user } = await _tokenLogin(token);
      if (user.err) {
        return res.status(401).json({ message: 'Invalid JWT token' });
      }
      if (user === null) {
        return res.status(401).json({ message: 'JWT token provided was blacklisted' });
      }
      return res.status(200).json({
        message: 'Successfully authenticated',
        user: user,
      });
    } else {
      return res.status(400).json({ message: 'Missing JWT token' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Failure when authenticating' });
  }
};

export const passwordLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(401).json({ message: 'Username and/or Password are missing!' });
    }

    const { user, userToken } = await _passwordLogin(username, password);
    if (userToken) {
      // Login is successful. Clear previous token if exist store JWT token in user's cookies.
      res.clearCookie('token');
      res.cookie('token', userToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      return res.status(200).json({ user: user, token: userToken });
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
    const { tokenUsername, password } = req.body;
    const username = await _deleteUser(token, tokenUsername, password);

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
    const { tokenUsername, currPassword, newPassword } = req.body;
    const isChanged = await _updatePassword(tokenUsername, currPassword, newPassword);

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
    const { token } = req.cookies;
    const { username, newPassword, tokenUsername } = req.body;
    if (username && newPassword) {
      const resp = await _resetPassword(username, newPassword, tokenUsername, token);
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

// For API gateway auth
export const authToken = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      const tokenUsername = await _authToken(token);
      if (tokenUsername.err) {
        return res.status(401).json({ message: 'Invalid JWT token' });
      }
      if (tokenUsername === null) {
        return res.status(401).json({ message: 'JWT token provided was blacklisted' });
      }
      return res.status(200).json({
        message: 'Successfully authenticated',
        tokenUsername: tokenUsername,
      });
    } else {
      return res.status(400).json({ message: 'Missing JWT token' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failure when authenticating' });
  }
};

export const uploadPicture = async (req, res) => {
  try {
    const { tokenUsername, imageURI } = req.body;
    const resp = await _uploadImage(tokenUsername, imageURI);
    if (resp === null || resp.err) {
      return res.status(400).json({ message: 'Image upload failed' });
    }
    return res.status(200).json({ message: 'Image upload success', imageUrl: resp });
  } catch (err) {
    return res.status(500).json({ message: 'Failure when uploading image' });
  }
};
