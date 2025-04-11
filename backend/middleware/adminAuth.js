import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.userId = decoded.userId;
    req.isAdmin = true;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default adminAuth; 