const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.database();
const usersRef = db.ref('users');

// Register new user (store additional user data)
router.post('/register', async (req, res) => {
  try {
    const { uid, email, businessName } = req.body;

    // Store user data in Firebase Realtime Database
    await usersRef.child(uid).set({
      email,
      businessName,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    });

    res.status(201).json({
      user: {
        uid,
        email,
        businessName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Get user data
router.get('/user/:uid', async (req, res) => {
  try {
    const snapshot = await usersRef.child(req.params.uid).once('value');
    const userData = snapshot.val();

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        uid: req.params.uid,
        ...userData,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

module.exports = router;
