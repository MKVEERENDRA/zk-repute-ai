// routes/farcasterReputation.js
const express = require('express');
const router = express.Router();
const { fetchFarcasterData, calculateFarcasterScore } = require('../services/farcasterFetcher');
const { generateZKProof } = require('../../circuits/farcaster/farcasterScore.circom');

// POST /api/farcaster-reputation
router.post('/farcaster-reputation', async (req, res) => {
  try {
    const { username, threshold = 100, secret = 12345 } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Farcaster username is required' });
    }

    const farcasterData = await fetchFarcasterData(username);
    const score = calculateFarcasterScore(farcasterData);

    const proofResult = await generateZKProof({
      score,
      threshold,
      secret
    });

    return res.json({
      username,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    console.error('Farcaster ZK proof error:', err);
    return res.status(500).json({ error: 'Farcaster ZK proof generation failed' });
  }
});

module.exports = router;
