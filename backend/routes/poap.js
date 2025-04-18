import express from 'express';
import { getPoapReputation } from '../services/poapFetcher.js';

const router = express.Router();

router.get('/:address', async (req, res) => {
  try {
    const address = req.params.address.toLowerCase();
    const rep = await getPoapReputation(address);
    res.json(rep);
  } catch (err) {
    console.error('POAP rep error:', err);
    res.status(500).json({ error: 'Failed to fetch POAP reputation' });
  }
});

export default router;
