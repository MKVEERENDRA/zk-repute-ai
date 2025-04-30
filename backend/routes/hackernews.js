const express = require('express');
const router = express.Router();
const { fetchHackerNewsData, calculateHNScore } = require('../services/hackernewsLogic');
const { generateZKProof } = require('../../circuits/hackernews/hackerNewsScore.circom');

router.post('/hackernews-reputation', async (req, res) => {
  try {
    const { username, threshold = 100, secret = 12345 } = req.body;
    if (!username) return res.status(400).json({ error: 'Hacker News username required' });

    const hnData = await fetchHackerNewsData(username);
    const score = calculateHNScore(hnData);

    const proofResult = await generateZKProof({
      score,
      threshold,
      secret
    });

    res.json({
      username,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    console.error('Hacker News ZK proof error:', err);
    res.status(500).json({ error: 'Hacker News ZK proof generation failed.' });
  }
});

module.exports = router;
