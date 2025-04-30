const express = require('express');
const router = express.Router();
const { fetchRedditData, calculateRedditScore } = require('../services/redditScoring');
const { generateZKProof } = require('../../circuits/reddit/redditScore.circom');

// POST /api/reddit-reputation
router.post('/reddit-reputation', async (req, res) => {
  try {
    const { username, threshold = 100, secret = 12345 } = req.body;
    if (!username) return res.status(400).json({ error: 'Reddit username required' });

    const redditData = await fetchRedditData(username);
    const score = calculateRedditScore(redditData);

    const proofResult = await generateZKProof({ score, threshold, secret });

    res.json({
      username,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    console.error('Reddit ZK proof error:', err);
    res.status(500).json({ error: 'Reddit ZK proof generation failed.' });
  }
});

module.exports = router;
