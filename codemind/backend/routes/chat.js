const express = require('express');
const { getAuth } = require('@clerk/express');
const { generateAIResponse } = require('../config/gemini');
const { getClient } = require('../config/supabase');

// Code review and AI responses are done by the Gemini API. Clerk is used only for authentication (identifying the user).
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
    const userId = getAuth(req).userId;
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const aiResponse = await generateAIResponse(message); // Gemini API performs the code review / AI response

    const supabase = getClient();
    await supabase.from('conversations').insert({
      user_id: userId,
      role: 'user',
      content: message,
    });
    await supabase.from('conversations').insert({
      user_id: userId,
      role: 'assistant',
      content: aiResponse,
    });

    res.json({ response: aiResponse });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'Failed to get AI response' });
  }
});

module.exports = router;
