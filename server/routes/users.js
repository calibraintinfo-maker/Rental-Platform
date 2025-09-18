const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile (protected)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile complete status
    user.checkProfileComplete();
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Update user profile (protected)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      contact,
      address,
      city,
      state,
      pincode
    } = req.body;

    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (contact) user.contact = contact;
    if (address) user.address = address;
    if (city) user.city = city;
    if (state) user.state = state;
    if (pincode) user.pincode = pincode;

    // Check if profile is complete
    user.checkProfileComplete();

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// Check if profile is complete (protected)
router.get('/profile/check-complete', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isComplete = user.checkProfileComplete();
    await user.save();

    res.json({ 
      profileComplete: isComplete,
      message: isComplete ? 'Profile is complete' : 'Profile is incomplete'
    });
  } catch (error) {
    console.error('Check profile complete error:', error);
    res.status(500).json({ message: 'Server error while checking profile' });
  }
});

module.exports = router;
