const express = require('express');
const router = express.Router();
const { calculateGoldfinchScore } = require('../services/goldfinchFetcher');
const path = require('path');
const { generateProofAndSignals } = require('../../utils/circomUtils');

// POST /api/goldfinch/score
router.post('/score', async (req, res) => {
  try {
    const { poolAddress, threshold = 0.5, secret = 12345, apiKey } = req.body;
    if (!poolAddress) return res.status(400).json({ error: 'Missing poolAddress' });
    // 1. Fetch Goldfinch metrics and score
    const goldfinchResult = await calculateGoldfinchScore(poolAddress, apiKey);
    // 2. Generate ZK proof for score >= threshold using circom compiled artifacts
    const circuitWasmPath = path.resolve(__dirname, '../../circuits/goldfinch/goldfinchScore_js/goldfinchScore.wasm');
    const zkeyPath = path.resolve(__dirname, '../../circuits/goldfinch/goldfinchScore_final.zkey');
    const input = {
      score: Math.round(goldfinchResult.score * 1000),
      threshold: Math.round(threshold * 1000),
      secret
    };
    const { proof, publicSignals } = await generateProofAndSignals(input, circuitWasmPath, zkeyPath);
    res.json({
      ...goldfinchResult,
      threshold,
      proof,
      publicSignals
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute Goldfinch score or generate ZK proof' });
  }
});

module.exports = router;
