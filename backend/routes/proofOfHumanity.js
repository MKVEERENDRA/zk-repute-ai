// backend/routes/proofOfHumanity.js
const express = require('express');
const router = express.Router();
const { computeHumanityScore } = require('../services/humanityScoreService');
const { generateZKProof } = require('../../circuits/humanity/HumanityScore.circom');

// GET /api/humanity/score/:address
router.get('/score/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const data = await computeHumanityScore(address);
    // Generate ZK proof for isVerified and vouchCount
    const proofResult = await generateZKProof({
      isVerified: data.isVerified ? 1 : 0,
      vouchCount: data.numberOfVouches
    });
    res.json({ ...data, proof: proofResult.proof, publicSignals: proofResult.publicSignals });
  } catch (err) {
    console.error('PoH Score Error:', err);
    res.status(500).json({ error: 'Failed to compute humanity score or ZK proof' });
  }
});

module.exports = router;
