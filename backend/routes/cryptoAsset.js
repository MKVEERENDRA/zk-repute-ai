const express = require('express');
const router = express.Router();
const { calculateCryptoScore } = require('../services/cryptoAssetFetcher');
const path = require('path');
const { generateProofAndSignals } = require('../../utils/circomUtils');

// POST /api/crypto/score
router.post('/score', async (req, res) => {
  try {
    const { wallet, threshold = 0.5, secret = 12345 } = req.body;
    if (!wallet) return res.status(400).json({ error: 'Missing wallet address' });
    const result = await calculateCryptoScore({ wallet });
    const circuitWasmPath = path.resolve(__dirname, '../../circuits/crypto/cryptoScore_js/cryptoScore.wasm');
    const zkeyPath = path.resolve(__dirname, '../../circuits/crypto/cryptoScore_final.zkey');
    const input = {
      score: Math.round(result.score * 1000),
      threshold: Math.round(threshold * 1000),
      secret
    };
    const { proof, publicSignals } = await generateProofAndSignals(input, circuitWasmPath, zkeyPath);
    res.json({ ...result, threshold, proof, publicSignals });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute crypto score or generate ZK proof' });
  }
});

module.exports = router;
