const express = require('express');
const router = express.Router();
const { fetchDevtoData, calculateDevtoScore } = require('../services/devtoLogic');
const { generateZKProof } = require('../../circuits/devto/devtoScoreCircuit.circum');

router.post('/devto-reputation', async (req, res) => {
  try {
    const { username, threshold = 100, secret = 12345 } = req.body;
    if (!username) return res.status(400).json({ error: 'Dev.to username required' });

    const devtoData = await fetchDevtoData(username);
    const score = calculateDevtoScore(devtoData);

    const proofResult = await generateZKProof({
      score,
      threshold,
      secret
    });

    return res.json({
      username,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    console.error('Dev.to ZK proof error:', err);
    res.status(500).json({ error: 'Dev.to ZK proof generation failed.' });
  }
});

module.exports = router;
