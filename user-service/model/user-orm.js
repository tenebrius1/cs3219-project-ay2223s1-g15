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
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// need to separate orm functions from repository to decouple business logic from persistence

export const ormCreateUser = async (email, username, password) => {
  try {
    password = await hashPassword(password);
    const newUser = await createUser({ email, username, password });

    // If user already exists, do not save in database
    const existingUser = await exists(email, username);
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
    if (user && bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ user_id: user._id, username }, process.env.JWT_TOKEN_KEY, {
        expiresIn: '10d',
      });
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
    if (user && bcrypt.compare(password, user.password)) {
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
    if (user && bcrypt.compare(currPassword, user.password)) {
      const hashedPassword = hashPassword(newPassword);
      await changePassword(username, hashedPassword);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return { err };
  }
};

export const ormRequestPasswordReset = async (username) => {
  try {
    // Check if user exists
    const user = await findUser(username);

    // If user exists
    if (user) {
      // Generate a JWT token to be used as a reset token.
      const resetToken = jwt.sign(
        { user: user._id, username },
        process.env.JWT_TOKEN_KEY,
        { expiresIn: '1h' }
      );

      // Connect to admin email account
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAIL_PW,
        },
      });

      // Create the email
      var mailOptions = {
        from: process.env.GMAIL,
        to: user.email,
        subject: 'Confirm Password Reset',
        html:
          `<p>Hi ${username},</p>` +
          `<p>You requested to reset your password.</p>` +
          `<p> Please, click the link below to reset your password</p>` +
          `<a href="http://localhost:8000/confirmPasswordReset?token=${resetToken}&user=${username}">Reset Password</a>`,
      };

      return { transporter: transporter, mailOptions: mailOptions };
    } else {
      return null;
    }
  } catch (err) {
    return { err };
  }
};

export const ormResetPassword = async (jwtToken, username, newPassword) => {
  try {
    const tokenUsername = jwt.decode(jwtToken).username;
    let user;

    // If provided token details match provided username
    if (tokenUsername == username) {
      user = await findUser(username);
    }
    if (user) {
      const hashedPassword = await hashPassword(newPassword);
      await changePassword(username, hashedPassword);

      // Blacklist JWT token so that user cannot reset password with same token again
      await blacklist(jwtToken);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
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

async function hashPassword(password) {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
}
