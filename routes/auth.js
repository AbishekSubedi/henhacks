const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register new user (store additional user data)
router.post('/register', async (req, res) => {
  try {
    const { uid, email, businessName } = req.body;

    // Create new user document
    const user = new User({
      uid,
      email,
      businessName
    });

    await user.save();

    res.status(201).json({
      user: {
        uid: user.uid,
        email: user.email,
        businessName: user.businessName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Get user data
router.get('/user/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        uid: user.uid,
        email: user.email,
        businessName: user.businessName,
        businessDetails: user.businessDetails
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

module.exports = router; 