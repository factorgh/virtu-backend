import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Get user from token
      req.user = await User.findOne({ name: decoded.name }).select('-password');
      req.user.role = decoded.role;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
