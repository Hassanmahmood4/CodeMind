const express = require('express');
const { getAuth } = require('@clerk/express');
const { getClient } = require('../config/supabase');

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
    const supabase = getClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }
    res.json(data || { clerk_id: userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
