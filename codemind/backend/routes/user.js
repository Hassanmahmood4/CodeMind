const express = require('express');
const { getAuth } = require('@clerk/express');
const { ensureUserFromClerkId } = require('../services/ensureUser');

const router = express.Router();

router.get('/me', (req, res, next) => {
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
    const userId = getAuth(req).userId;
    const user = await ensureUserFromClerkId(userId);
    res.json(user);
  } catch (err) {
    console.error('User sync error:', err);
    res.status(500).json({ error: err.message || 'Failed to load user' });
  }
});

module.exports = router;
