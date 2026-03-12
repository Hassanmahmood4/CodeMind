const express = require('express');
const { getAuth } = require('@clerk/express');
const { reviewRepository } = require('../services/repoReview');

const router = express.Router();

router.post('/', (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}, async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl || typeof repoUrl !== 'string') {
      return res.status(400).json({ error: 'repoUrl is required' });
    }

    const result = await reviewRepository(repoUrl);
    res.json(result);
  } catch (err) {
    console.error('Review repo error:', err);
    const message = err.message || 'Failed to review repository';
    res.status(400).json({ error: message });
  }
});

module.exports = router;
