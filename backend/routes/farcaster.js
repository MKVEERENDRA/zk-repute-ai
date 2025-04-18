import express from 'express';
import { getFarcasterReputation } from '../services/farcasterFetcher.js';

const router = express.Router();

router.get('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const rep = await getFarcasterReputation(username);
    res.json(rep);
  } catch (err) {
    console.error('Farcaster rep error:', err);
    res.status(500).json({ error: 'Failed to fetch Farcaster reputation' });
  }
});

export default router;
