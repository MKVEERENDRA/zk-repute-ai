const express = require('express');
const router = express.Router();
const { fetchSOData, calculateSOScore } = require('../services/stackOverflowFetcher');
const { generateZKProof } = require('../../circuits/stackoverflow/stackoverflowScore.circom');

// POST /api/stackoverflow-reputation
router.post('/stackoverflow-reputation', async (req, res) => {
  try {
    const { userId, threshold = 100, secret = 12345 } = req.body;
    if (!userId) return res.status(400).json({ error: 'Stack Overflow userId required' });

    const data = await fetchSOData(userId);
    const score = calculateSOScore(data);

    const proofResult = await generateZKProof({ score, threshold, secret });

    res.json({
      userId,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    console.error('Stack Overflow reputation error:', err);
    res.status(500).json({ error: 'SO reputation ZK generation failed' });
  }
});

module.exports = router;
