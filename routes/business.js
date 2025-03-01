const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');
const User = require('../models/User');

// Initialize Firebase Admin
const serviceAccount = require('../config/firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Middleware to verify Firebase token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Update business details
router.post('/update-details', authenticateToken, async (req, res) => {
  try {
    const { category, description, location, contactNumber, additionalInfo } = req.body;

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Analyze business information using Gemini AI
    const prompt = `Analyze the following business information and provide structured insights:
    Category: ${category}
    Description: ${description}
    Additional Information: ${additionalInfo}
    
    Please provide:
    1. Key business strengths
    2. Target audience
    3. Potential growth areas
    4. Marketing suggestions
    5. Digital presence recommendations`;

    const result = await model.generateContent(prompt);
    const analyzedInfo = result.response.text();

    // Update user's business details
    const updatedUser = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        businessDetails: {
          category,
          description,
          location,
          contactNumber,
          additionalInfo,
          analyzedInfo
        }
      },
      { new: true }
    );

    res.json({
      message: 'Business details updated successfully',
      businessDetails: updatedUser.businessDetails
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating business details', error: error.message });
  }
});

// Get business details
router.get('/details', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ businessDetails: user.businessDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business details', error: error.message });
  }
});

module.exports = router; 