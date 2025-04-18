import express from 'express';
import { getStackOverflowReputation } from '../services/stackoverflowFetcher.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const rep = await getStackOverflowReputation(userId);
    res.json(rep);
  } catch (err) {
    console.error('StackOverflow rep error:', err);
    res.status(500).json({ error: 'Failed to fetch StackOverflow reputation' });
  }
});

export default router;
