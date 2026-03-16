const express = require('express');
const { getAuth } = require('@clerk/express');
const { getPrisma } = require('../config/prisma');
const { ensureUserFromClerkId } = require('../services/ensureUser');

const router = express.Router();

function authMiddleware(req, res, next) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.clerkId = userId;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

router.use(authMiddleware);

/** GET /api/reviews – list current user's saved reviews (newest first) */
router.get('/', async (req, res) => {
  try {
    const prisma = getPrisma();
    const list = await prisma.savedReview.findMany({
      where: { userClerkId: req.clerkId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, createdAt: true },
    });
    res.json(list);
  } catch (err) {
    console.error('List reviews error:', err);
    res.status(500).json({ error: err.message || 'Failed to list reviews' });
  }
});

/** POST /api/reviews – save current review (code + result). Optional title. */
router.post('/', async (req, res) => {
  try {
    const { title, code, language, reviewResult } = req.body || {};
    await ensureUserFromClerkId(req.clerkId);
    const prisma = getPrisma();
    const created = await prisma.savedReview.create({
      data: {
        userClerkId: req.clerkId,
        title: typeof title === 'string' && title.trim() ? title.trim().slice(0, 200) : 'Review',
        code: typeof code === 'string' ? code : null,
        language: typeof language === 'string' ? language : null,
        reviewResult: typeof reviewResult === 'string' ? reviewResult : null,
      },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('Save review error:', err);
    res.status(500).json({ error: err.message || 'Failed to save review' });
  }
});

/** GET /api/reviews/:id – get one saved review (must belong to current user) */
router.get('/:id', async (req, res) => {
  try {
    const prisma = getPrisma();
    const review = await prisma.savedReview.findFirst({
      where: { id: req.params.id, userClerkId: req.clerkId },
    });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (err) {
    console.error('Get review error:', err);
    res.status(500).json({ error: err.message || 'Failed to get review' });
  }
});

/** PATCH /api/reviews/:id – rename a saved review (must belong to current user) */
router.patch('/:id', async (req, res) => {
  try {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim().slice(0, 200) : '';
    if (!title) return res.status(400).json({ error: 'title is required' });

    const prisma = getPrisma();
    const updated = await prisma.savedReview.updateMany({
      where: { id: req.params.id, userClerkId: req.clerkId },
      data: { title },
    });
    if (updated.count === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ id: req.params.id, title });
  } catch (err) {
    console.error('Rename review error:', err);
    res.status(500).json({ error: err.message || 'Failed to rename review' });
  }
});

/** DELETE /api/reviews/:id – delete a saved review (must belong to current user) */
router.delete('/:id', async (req, res) => {
  try {
    const prisma = getPrisma();
    const deleted = await prisma.savedReview.deleteMany({
      where: { id: req.params.id, userClerkId: req.clerkId },
    });
    if (deleted.count === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ error: err.message || 'Failed to delete review' });
  }
});

module.exports = router;
