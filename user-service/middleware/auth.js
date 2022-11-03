import { ormAuthToken } from '../model/user-orm.js';

export const authenticate = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const tokenUsername = await ormAuthToken(token);
    if (tokenUsername.err || tokenUsername === null) {
      res.clearCookie('token');
      return res.status(401).json({ message: 'Invalid JWT token' });
    }
    req.body.tokenUsername = tokenUsername;
    next();
  } else {
    return res.status(401).json({ message: 'Missing JWT token' });
  }
};

export default authenticate;
