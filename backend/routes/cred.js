const express = require('express');
const router = express.Router();
const { calculateCredScore } = require('../services/credFetcher');
const path = require('path');
const { generateProofAndSignals } = require('../../circuits/cred/credScore.circom');

// POST /api/cred/score
router.post('/score', async (req, res) => {
  try {
    const { address, threshold = 0.5, secret = 12345, accessToken } = req.body;
    if (!address || !accessToken) return res.status(400).json({ error: 'Missing address or accessToken' });
    // 1. Fetch Cred metrics and score
    const credResult = await calculateCredScore(address, accessToken);
    // 2. Generate ZK proof for score >= threshold using circom compiled artifacts
    const circuitWasmPath = path.resolve(__dirname, '../../circuits/cred/credScore_js/credScore.wasm');
    const zkeyPath = path.resolve(__dirname, '../../circuits/cred/credScore_final.zkey');
    const input = {
      score: Math.round(credResult.score * 1000),
      threshold: Math.round(threshold * 1000),
      secret
    };
    const { proof, publicSignals } = await generateProofAndSignals(input, circuitWasmPath, zkeyPath);
    res.json({
      ...credResult,
      threshold,
      proof,
      publicSignals
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute Cred score or generate ZK proof' });
  }
});

module.exports = router;
