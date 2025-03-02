const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini Pro
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const db = admin.database();
const businessesRef = db.ref('businesses');

// Create a new business
router.post('/', async (req, res) => {
  try {
    const { name, description, userId } = req.body;

    const newBusinessRef = businessesRef.push();
    await newBusinessRef.set({
      name,
      description,
      userId,
      createdAt: admin.database.ServerValue.TIMESTAMP,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
    });

    res.status(201).json({
      id: newBusinessRef.key,
      name,
      description,
      userId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating business', error: error.message });
  }
});

// Get all businesses for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const snapshot = await businessesRef
      .orderByChild('userId')
      .equalTo(req.params.userId)
      .once('value');

    const businesses = [];
    snapshot.forEach(childSnapshot => {
      businesses.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    res.json({ businesses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching businesses', error: error.message });
  }
});

// Get a single business
router.get('/:id', async (req, res) => {
  try {
    const snapshot = await businessesRef.child(req.params.id).once('value');
    const business = snapshot.val();

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.json({
      id: req.params.id,
      ...business,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business', error: error.message });
  }
});

// Update a business
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;

    await businessesRef.child(req.params.id).update({
      name,
      description,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
    });

    res.json({
      id: req.params.id,
      name,
      description,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating business', error: error.message });
  }
});

// Delete a business
router.delete('/:id', async (req, res) => {
  try {
    await businessesRef.child(req.params.id).remove();
    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting business', error: error.message });
  }
});

// Generate business insights using Gemini Pro
router.post('/:id/insights', async (req, res) => {
  try {
    const { businessData } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this business data and provide strategic insights and recommendations:
      ${JSON.stringify(businessData, null, 2)}
      
      Please provide:
      1. Key strengths and opportunities
      2. Areas for improvement
      3. Strategic recommendations
      4. Potential growth opportunities`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();

    res.json({ insights });
  } catch (error) {
    res.status(500).json({ message: 'Error generating insights', error: error.message });
  }
});

module.exports = router;
