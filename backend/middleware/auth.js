import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
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

    // Check for permanent suspension
    if (user.isPermanentlySuspended) {
      return res.status(403).json({
        message: 'Your account has been permanently suspended.',
        isSuspended: true,
        isPermanent: true
      });
    }

    // Check for temporary suspension
    if (user.isSuspended && user.suspensionEndsAt) {
      const now = new Date();
      if (now < user.suspensionEndsAt) {
        const hoursLeft = Math.ceil((user.suspensionEndsAt - now) / (1000 * 60 * 60));
        return res.status(403).json({
          message: `Your account is suspended for ${hoursLeft} more hours.`,
          isSuspended: true,
          isPermanent: false,
          suspensionEndsAt: user.suspensionEndsAt
        });
      } else {
        // Suspension period is over, clear the suspension
        user.isSuspended = false;
        user.suspensionEndsAt = null;
        await user.save();
      }
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

export const isAdmin = async (req, res, next) => {
  try {
    // First run the auth middleware
    await auth(req, res, () => {});

    // If auth middleware sent a response, return early
    if (res.headersSent) {
      return;
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ 
      message: 'Authorization error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 