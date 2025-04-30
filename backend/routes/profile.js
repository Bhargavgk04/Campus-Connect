import express from 'express';
import { Router } from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

// Get user profile by ID (for viewing other users' profiles)
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select('-password')
      .populate('skills')
      .populate('achievements')
      .populate('education');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Allow access if:
    // 1. User is viewing their own profile
    // 2. User is an admin
    // 3. The profile is public
    if (req.user._id.toString() !== userId && 
        req.user.role !== 'admin' && 
        !user.isPublic) {
      return res.status(403).json({ message: 'Access denied' });
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
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return some basic stats
    res.json({
      totalPosts: 0, // You can implement this based on your post model
      totalComments: 0, // You can implement this based on your comment model
      totalLikes: 0, // You can implement this based on your like model
      joinDate: user.createdAt
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get user activity
router.get('/activity', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return recent activity
    res.json({
      recentPosts: [], // You can implement this based on your post model
      recentComments: [], // You can implement this based on your comment model
      recentLikes: [] // You can implement this based on your like model
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get additional user info
router.get('/additional-info', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return additional user info
    res.json({
      skills: user.skills || [],
      education: user.education || [],
      achievements: user.achievements || [],
      socialLinks: {
        linkedin: user.linkedinProfile || '',
        github: user.github || '',
        twitter: user.twitter || ''
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow users to update their own profile
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

// Update skills
router.put('/:userId/skills', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow users to update their own skills
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own skills' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { skills: req.body.skills } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user skills:', error);
    res.status(500).json({ message: 'Error updating user skills' });
  }
});

// Update achievements
router.put('/:userId/achievements', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow users to update their own achievements
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own achievements' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { achievements: req.body.achievements } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user achievements:', error);
    res.status(500).json({ message: 'Error updating user achievements' });
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