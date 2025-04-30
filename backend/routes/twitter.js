const express = require('express');
const router = express.Router();
const { calculateTwitterReputationScore, generateZKProof } = require('../services/twitterLogic');
const { generateZKProof } = require('../../circuits/twitter/twitterScore.circom');

// POST /api/twitter-reputation
router.post('/twitter-reputation', async (req, res) => {
  try {
    const { username, threshold = 100, secret = 12345 } = req.body;

    // Validate username
    if (!username) {
      return res.status(400).json({ error: 'Twitter username is required' });
    }

    // Step 1: Calculate the reputation score using Twitter data and metrics
    const score = await calculateTwitterReputationScore(username);

    // Step 2: Generate the ZK proof for the calculated score
    const proofResult = await generateZKProof(score, threshold, secret);

    // Step 3: Return the result with the proof, public signals, and score
    return res.json({
      username,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });

  } catch (err) {
    console.error('Twitter ZK proof error:', err);
    return res.status(500).json({ error: 'Twitter ZK proof generation failed' });
  }
});

module.exports = router;
