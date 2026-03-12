require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');
const reviewRepoRoutes = require('./routes/reviewRepo');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Clerk: validate session tokens and attach req.auth (must run before protected routes)
app.use(clerkMiddleware());

app.get('/', (req, res) => {
  res.json({ message: 'CodeMind API', docs: { health: 'GET /api/health', chat: 'POST /api/chat', user: 'GET /api/user/me' } });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/review-repo', reviewRepoRoutes);

// Global error handler: prevent unhandled errors from returning empty 500
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  if (!process.env.CLERK_SECRET_KEY) {
    console.warn('Warning: CLERK_SECRET_KEY is not set. Auth will fail.');
  }
  console.log(`Server running on http://localhost:${PORT}`);
});
