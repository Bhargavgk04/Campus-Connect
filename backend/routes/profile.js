import express from 'express';
import { Router } from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure profile picture URL is complete
    if (user.profilePicture && !user.profilePicture.startsWith('http')) {
      user.profilePicture = `http://localhost:8080${user.profilePicture}`;
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return basic stats
    res.json({
      joinDate: user.createdAt,
      totalPosts: 0,
      totalComments: 0,
      totalLikes: 0
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user stats' });
  }
});

// Get user activity
router.get('/activity', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return empty activity arrays for now
    res.json({
      recentPosts: [],
      recentComments: [],
      recentLikes: []
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ message: 'Error fetching user activity' });
  }
});

// Get additional user info
router.get('/additional-info', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('skills achievements education socialLinks');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      skills: user.skills || [],
      achievements: user.achievements || [],
      education: user.education || [],
      socialLinks: user.socialLinks || {
        github: "",
        twitter: "",
        linkedin: ""
      }
    });
  } catch (error) {
    console.error('Error fetching additional info:', error);
    res.status(500).json({ message: 'Error fetching additional info' });
  }
});

// Update user skills
router.put('/skills', auth, async (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { skills } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the updated user data
    res.json({
      skills: user.skills,
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Error updating skills:', error);
    res.status(500).json({ message: 'Error updating skills' });
  }
});

// Update user achievements
router.put('/achievements', auth, async (req, res) => {
  try {
    const { achievements } = req.body;
    if (!Array.isArray(achievements)) {
      return res.status(400).json({ message: 'Achievements must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { achievements } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the updated user data
    res.json({
      achievements: user.achievements,
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Error updating achievements:', error);
    res.status(500).json({ message: 'Error updating achievements' });
  }
});

// Upload profile picture
router.post('/upload-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's profile picture
    user.profilePicture = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePicture: `http://localhost:8080${user.profilePicture}`
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Error uploading profile picture' });
  }
});

export default router; 