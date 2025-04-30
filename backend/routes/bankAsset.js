const express = require('express');
const router = express.Router();
const { calculateBankScore } = require('../services/bankAssetFetcher');
const path = require('path');
const { generateProofAndSignals } = require('../../utils/circomUtils');

// POST /api/bank/score
router.post('/score', async (req, res) => {
  try {
    const { cash, stablecoins, threshold = 0.5, secret = 12345 } = req.body;
    if (cash === undefined || stablecoins === undefined) return res.status(400).json({ error: 'Missing required bank asset fields' });
    const result = await calculateBankScore({ cash, stablecoins });
    const circuitWasmPath = path.resolve(__dirname, '../../circuits/bank/bankScore_js/bankScore.wasm');
    const zkeyPath = path.resolve(__dirname, '../../circuits/bank/bankScore_final.zkey');
    const input = {
      score: Math.round(result.score * 1000),
      threshold: Math.round(threshold * 1000),
      secret
    };
    const { proof, publicSignals } = await generateProofAndSignals(input, circuitWasmPath, zkeyPath);
    res.json({ ...result, threshold, proof, publicSignals });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute bank score or generate ZK proof' });
  }
});

module.exports = router;
