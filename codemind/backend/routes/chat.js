const express = require('express');
const { getAuth } = require('@clerk/express');
const { generateAIResponse, generateAIResponseStream } = require('../config/gemini');
const { getPrisma } = require('../config/prisma');
const { ensureUserFromClerkId } = require('../services/ensureUser');

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

    try {
      const prisma = getPrisma();
      await ensureUserFromClerkId(userId);
      await prisma.conversation.createMany({
        data: [
          { userClerkId: userId, role: 'user', content: message },
          { userClerkId: userId, role: 'assistant', content: aiResponse },
        ],
      });
    } catch (dbErr) {
      console.warn('DB save skipped:', dbErr.message);
    }

    res.json({ response: aiResponse });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'Failed to get AI response' });
  }
});

// Streaming: faster perceived speed – review text streams as it's generated
router.post('/stream', (req, res, next) => {
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

    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders && res.flushHeaders();

    let fullText = '';
    for await (const chunk of generateAIResponseStream(message)) {
      fullText += chunk;
      res.write(JSON.stringify({ text: chunk }) + '\n');
      if (res.flush) res.flush();
    }
    res.end();

    try {
      const prisma = getPrisma();
      await ensureUserFromClerkId(userId);
      await prisma.conversation.createMany({
        data: [
          { userClerkId: userId, role: 'user', content: message },
          { userClerkId: userId, role: 'assistant', content: fullText },
        ],
      });
    } catch (dbErr) {
      console.warn('DB save skipped:', dbErr.message);
    }
  } catch (err) {
    console.error('Chat stream error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Failed to get AI response' });
    } else {
      res.write(JSON.stringify({ error: err.message }) + '\n');
      res.end();
    }
  }
});

module.exports = router;
