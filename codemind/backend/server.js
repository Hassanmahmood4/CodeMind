require('dotenv').config();

// Backend needs BOTH Clerk keys; @clerk/express throws "Publishable key is missing" otherwise
if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  console.error('');
  console.error('Missing Clerk keys in codemind/backend/.env');
  console.error('Add both (same app as frontend):');
  console.error('  CLERK_PUBLISHABLE_KEY=pk_test_...   (same value as frontend .env VITE_CLERK_PUBLISHABLE_KEY)');
  console.error('  CLERK_SECRET_KEY=sk_test_...');
  console.error('Get them from: https://dashboard.clerk.com/last-active?path=api-keys');
  console.error('');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express');
const { devAuthBypass } = require('./middleware/devAuthBypass');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');
const reviewRepoRoutes = require('./routes/reviewRepo');
const reviewsRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Clerk: validate Bearer JWT from frontend (Authorization: Bearer <token>) and attach req.auth
app.use(clerkMiddleware());
// Dev only: if no valid token, use placeholder userId so Review Code works without Clerk token fix
app.use(devAuthBypass);

app.get('/', (req, res) => {
  res.json({ message: 'CodeMind API', docs: { health: 'GET /api/health', chat: 'POST /api/chat', user: 'GET /api/user/me' } });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/review-repo', reviewRepoRoutes);
app.use('/api/reviews', reviewsRoutes);

// Global error handler: prevent unhandled errors from returning empty 500
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const server = app.listen(PORT, () => {
  if (!process.env.CLERK_SECRET_KEY) {
    console.warn('Warning: CLERK_SECRET_KEY is not set. Auth will fail.');
  }
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Kill it with: lsof -ti :${PORT} | xargs kill -9`);
    process.exit(1);
  }
  throw err;
});
