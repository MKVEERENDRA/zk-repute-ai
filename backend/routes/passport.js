// backend/routes/passport.js
const express = require('express');
const router = express.Router();
const { fetchPassportScore } = require('../services/passportFetcher');
const { generateZKProof } = require('../../circuits/passport/passportScore.circom');

// POST /api/passport/score
router.post('/score', async (req, res) => {
  try {
    const { scorerId, walletAddress, threshold = 50, secret = 12345 } = req.body;
    if (!scorerId || !walletAddress) {
      return res.status(400).json({ error: 'scorerId and walletAddress are required' });
    }
    // 1. Fetch Passport.xyz score and metrics
    const result = await fetchPassportScore(scorerId, walletAddress);
    // 2. Generate ZK proof for Passport score
    const proofResult = await generateZKProof({
      score: result.score,
      threshold,
      secret
    });
    res.json({
      ...result,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch Passport score or generate ZK proof' });
  }
});

module.exports = router;
