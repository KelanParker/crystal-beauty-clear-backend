import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
  const header = req.headers['authorization'];

  if (header && header.startsWith('Bearer ')) {
    const token = header.split(' ')[1];

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

export default verifyJWT;
