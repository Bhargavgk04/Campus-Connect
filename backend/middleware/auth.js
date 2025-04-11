import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.error('No token found in cookies');
      return res.status(401).json({ message: 'Authentication required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!decoded.userId) {
      console.error('No userId in decoded token');
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.error('User not found for ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Authentication error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default auth;
