const express = require('express');
const router = express.Router();
const { calculateLuxuryScore } = require('../services/luxuryAssetFetcher');
const path = require('path');
const { generateProofAndSignals } = require('../../utils/circomUtils');

// POST /api/luxury/score
router.post('/score', async (req, res) => {
  try {
    const { type, brand, value, threshold = 0.5, secret = 12345 } = req.body;
    if (!type || !brand || !value) return res.status(400).json({ error: 'Missing required luxury asset fields' });
    const result = await calculateLuxuryScore({ type, brand, value });
    const circuitWasmPath = path.resolve(__dirname, '../../circuits/luxury/luxuryScore_js/luxuryScore.wasm');
    const zkeyPath = path.resolve(__dirname, '../../circuits/luxury/luxuryScore_final.zkey');
    const input = {
      score: Math.round(result.score * 1000),
      threshold: Math.round(threshold * 1000),
      secret
    };
    const { proof, publicSignals } = await generateProofAndSignals(input, circuitWasmPath, zkeyPath);
    res.json({ ...result, threshold, proof, publicSignals });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute luxury asset score or generate ZK proof' });
  }
});

module.exports = router;
