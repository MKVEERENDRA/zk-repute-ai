import express from 'express';
import { getLensReputation } from '../services/lensFetcher.js';

const router = express.Router();

router.get('/:handle', async (req, res) => {
  try {
    const handle = req.params.handle;
    const rep = await getLensReputation(handle);
    res.json(rep);
  } catch (err) {
    console.error('Lens rep error:', err);
    res.status(500).json({ error: 'Failed to fetch Lens reputation' });
  }
});

export default router;
