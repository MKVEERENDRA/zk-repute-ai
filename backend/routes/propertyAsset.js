const express = require('express');
const router = express.Router();
const { calculatePropertyScore } = require('../services/propertyAssetFetcher');
const path = require('path');
const { generateProofAndSignals } = require('../../utils/circomUtils');

// POST /api/property/score
router.post('/score', async (req, res) => {
  try {
    const { type, location, value, year, threshold = 0.5, secret = 12345 } = req.body;
    if (!type || !value || !year) return res.status(400).json({ error: 'Missing required property fields' });
    const result = await calculatePropertyScore({ type, location, value, year });
    const circuitWasmPath = path.resolve(__dirname, '../../circuits/property/propertyScore_js/propertyScore.wasm');
    const zkeyPath = path.resolve(__dirname, '../../circuits/property/propertyScore_final.zkey');
    const input = {
      score: Math.round(result.score * 1000),
      threshold: Math.round(threshold * 1000),
      secret
    };
    const { proof, publicSignals } = await generateProofAndSignals(input, circuitWasmPath, zkeyPath);
    res.json({ ...result, threshold, proof, publicSignals });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute property score or generate ZK proof' });
  }
});

module.exports = router;
