const express = require('express');
const router = express.Router();
const { calculateStockScore } = require('../services/stockAssetFetcher');
const path = require('path');
const { generateProofAndSignals } = require('../../utils/circomUtils');

// POST /api/stock/score
router.post('/score', async (req, res) => {
  try {
    const { value, broker, threshold = 0.5, secret = 12345 } = req.body;
    if (!value || !broker) return res.status(400).json({ error: 'Missing required stock fields' });
    const result = await calculateStockScore({ value, broker });
    const circuitWasmPath = path.resolve(__dirname, '../../circuits/stock/stockScore_js/stockScore.wasm');
    const zkeyPath = path.resolve(__dirname, '../../circuits/stock/stockScore_final.zkey');
    const input = {
      score: Math.round(result.score * 1000),
      threshold: Math.round(threshold * 1000),
      secret
    };
    const { proof, publicSignals } = await generateProofAndSignals(input, circuitWasmPath, zkeyPath);
    res.json({ ...result, threshold, proof, publicSignals });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute stock score or generate ZK proof' });
  }
});

module.exports = router;
