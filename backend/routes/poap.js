const express = require('express');
const router = express.Router();
const { fetchPOAPData, calculatePOAPReputationScore } = require('../services/poapFetcher');
const { generateZKProof } = require('../../circuits/poap/poapScore.circom');

router.post('/poap-reputation', async (req, res) => {
  try {
    const { address, threshold = 100, secret = 12345 } = req.body;
    if (!address) return res.status(400).json({ error: 'Wallet address is required' });

    const poapData = await fetchPOAPData(address);
    const score = calculatePOAPReputationScore(poapData);

    const proofResult = await generateZKProof({
      score,
      threshold,
      secret
    });

    res.json({
      address,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    console.error('POAP reputation error:', err);
    res.status(500).json({ error: 'POAP ZK proof generation failed' });
  }
});

module.exports = router;
