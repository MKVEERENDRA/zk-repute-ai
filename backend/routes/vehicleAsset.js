const express = require('express');
const router = express.Router();
const { calculateVehicleScore } = require('../services/vehicleAssetFetcher');
const path = require('path');
const { generateProofAndSignals } = require('../../utils/circomUtils');

// POST /api/vehicle/score
router.post('/score', async (req, res) => {
  try {
    const { type, model, age, value, threshold = 0.5, secret = 12345 } = req.body;
    if (!type || !model || !age || !value) return res.status(400).json({ error: 'Missing required vehicle fields' });
    const result = await calculateVehicleScore({ type, model, age, value });
    const circuitWasmPath = path.resolve(__dirname, '../../circuits/vehicle/vehicleScore_js/vehicleScore.wasm');
    const zkeyPath = path.resolve(__dirname, '../../circuits/vehicle/vehicleScore_final.zkey');
    const input = {
      score: Math.round(result.score * 1000),
      threshold: Math.round(threshold * 1000),
      secret
    };
    const { proof, publicSignals } = await generateProofAndSignals(input, circuitWasmPath, zkeyPath);
    res.json({ ...result, threshold, proof, publicSignals });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute vehicle score or generate ZK proof' });
  }
});

module.exports = router;
