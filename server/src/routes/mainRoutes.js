const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

// Protected route example
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'User profile',
    userId: req.userId,
    userEmail: req.userEmail,
  });
});

module.exports = router;
