// backend/routes/mirrorParagraph.js
import express from 'express';
import {
  fetchMirrorArticles,
  fetchParagraphArticles,
  scoreContributions
} from '../services/mirrorParagraphFetcher.js';

const router = express.Router();

// Endpoint to fetch and score Mirror Articles
router.post('/mirror/score', async (req, res) => {
  const { userId } = req.body;
  try {
    const articles = await fetchMirrorArticles(userId);
    const score = scoreContributions(articles, 'mirror');
    res.json({ score, articles });
  } catch (error) {
    console.error('Error fetching Mirror articles:', error);
    res.status(500).json({ error: 'Failed to fetch Mirror articles' });
  }
});

// Endpoint to fetch and score Paragraph Articles
router.post('/paragraph/score', async (req, res) => {
  const { userId } = req.body;
  try {
    const articles = await fetchParagraphArticles(userId);
    const score = scoreContributions(articles, 'paragraph');
    res.json({ score, articles });
  } catch (error) {
    console.error('Error fetching Paragraph articles:', error);
    res.status(500).json({ error: 'Failed to fetch Paragraph articles' });
  }
});

export default router;
