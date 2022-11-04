import axios from 'axios';

export const authenticate = async (req, res, next) => {
  const { token } = req.cookies;
  await axios
    .get('http://localhost:8000/auth', {
      headers: {
        Cookie: `token=${token}`,
      },
    })
    .then((resp) => {
      if (resp.status != 200) {
        res.status(401).json({ message: 'Invalid JWT token' });
      }
      next();
    })
    .catch(() => res.status(401).json({ message: 'Missing JWT token' }));
};

export default authenticate;
