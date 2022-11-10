import axios from 'axios';

export const authenticate = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    console.log(req);
    return res.status(401).json({ message: 'Missing JWT token' });
  }
  await axios
    .get(process.env.USER_URL + '/user/checkAuth', {
      headers: { Cookie: `token=${token}` },
    })
    .then((resp) => {
      next();
    })
    .catch((err) => {
      return res.status(401).json({ message: 'JWT token authentication failed' });
    });
};

export default authenticate;
