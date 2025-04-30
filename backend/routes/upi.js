// backend/routes/upi.js
// Modular UPI score and ZK proof route
const express = require('express');
const router = express.Router();
const { calculateUPIScore } = require('../services/upiScoreCalculator');
const { generateZKProof } = require('../../circuits/upi/upiScore.circom');

// POST /api/upi/score
router.post('/score', async (req, res) => {
  try {
    const { transactions, balanceHistory, threshold = 50, secret = 12345 } = req.body;
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: 'Transactions array required' });
    }
    // 1. Calculate modular UPI metrics
    const metrics = calculateUPIScore({ transactions, balanceHistory: balanceHistory || [] });

    // 2. Generate ZK proof for modular metrics (if required)
    const proofResult = await generateZKProof(metrics, threshold, secret);

    res.json({
      ...metrics,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    console.error('UPI Score/Proof Error:', err);
    res.status(500).json({ error: 'Failed to calculate UPI score or ZK proof' });
  }
});

module.exports = router;