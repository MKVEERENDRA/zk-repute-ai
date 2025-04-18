import express from 'express';
import { getTwitterReputation } from '../services/twitterFetcher.js';

const router = express.Router();

router.get('/:handle', async (req, res) => {
  try {
    const handle = req.params.handle;
    const rep = await getTwitterReputation(handle);
    res.json(rep);
  } catch (err) {
    console.error('Twitter rep error:', err);
    res.status(500).json({ error: 'Failed to fetch Twitter reputation' });
  }
});

export default router;
