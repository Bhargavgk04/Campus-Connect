import express from 'express';
import { Router } from 'express';
import User from '../models/User.js';
import College from '../models/College.js';
import Question from '../models/Question.js';
import Report from '../models/Report.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

// Get all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get dashboard statistics
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get total colleges
    const totalColleges = await College.countDocuments();
    
    // Get total questions
    const totalQuestions = await Question.countDocuments();
    
    // Get reported content count (pending reports)
    const reportedContent = await Report.countDocuments({ status: 'pending' });
    
    // Get recent activity
    const recentActivity = await Promise.all([
      // Get recent college requests (colleges created in last 7 days)
      College.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name createdAt createdBy')
        .populate('createdBy', 'name'),
      
      // Get recent admin requests (users with admin role created in last 7 days)
      User.find({ role: 'admin' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt')
    ]);

    res.json({
      totalUsers,
      totalColleges,
      totalQuestions,
      reportedContent,
      recentActivity: {
        newColleges: recentActivity[0],
        newAdmins: recentActivity[1]
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

export default router; 