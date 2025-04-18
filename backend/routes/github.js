import express from 'express';
import { getGitHubStats } from '../services/githubFetcher.js';

const router = express.Router();

router.get('/:username', async (req, res) => {
  try {
    const stats = await getGitHubStats(req.params.username);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
