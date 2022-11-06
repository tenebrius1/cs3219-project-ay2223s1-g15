import axios from 'axios';

export const authenticate = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
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
      console.log(err.response.data.message);
      return res.status(401).json({ message: 'JWT token authentication failed' });
    });
};

export default authenticate;
