const express = require('express');
const router = express.Router();
const { calculateCentrifugeScore } = require('../services/centrifugeFetcher');
const path = require('path');
const { generateProofAndSignals } = require('../../utils/circomUtils');

// POST /api/centrifuge/score
router.post('/score', async (req, res) => {
  try {
    const { poolId, threshold = 0.5, secret = 12345 } = req.body;
    if (!poolId) return res.status(400).json({ error: 'Missing poolId' });
    // 1. Fetch Centrifuge metrics and score
    const centrifugeResult = await calculateCentrifugeScore(poolId);
    // 2. Generate ZK proof for score >= threshold using circom compiled artifacts
    const circuitWasmPath = path.resolve(__dirname, '../../circuits/centrifuge/centrifugeScore_js/centrifugeScore.wasm');
    const zkeyPath = path.resolve(__dirname, '../../circuits/centrifuge/centrifugeScore_final.zkey');
    const input = {
      score: Math.round(centrifugeResult.score * 1000),
      threshold: Math.round(threshold * 1000),
      secret
    };
    const { proof, publicSignals } = await generateProofAndSignals(input, circuitWasmPath, zkeyPath);
    res.json({
      ...centrifugeResult,
      threshold,
      proof,
      publicSignals
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute Centrifuge score or generate ZK proof' });
  }
});

module.exports = router;
