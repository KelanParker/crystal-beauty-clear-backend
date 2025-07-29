import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default function verifyJWT(req, res, next) {
    const header = req.headers['authorization'];
    if (header != null && header.startsWith('Bearer ')) {
      req.token = header.split(' ')[1];
      jwt.verify(req.token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
      });
    } else {
      next();
    }
  }