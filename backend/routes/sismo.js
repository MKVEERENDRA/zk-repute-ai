// backend/routes/sismo.js
const express = require('express');
const router = express.Router();
const { fetchSismoData, extractSismoMetrics } = require('../services/sismoFetcher');
const { generateZKProof } = require('../../circuits/sismo/sismoScore.circom');

// POST /api/sismo/score
router.post('/score', async (req, res) => {
  try {
    const { addressOrId, threshold = 50, secret = 12345 } = req.body;
    if (!addressOrId) return res.status(400).json({ error: 'addressOrId required' });
    const sismoData = await fetchSismoData(addressOrId);
    const metrics = extractSismoMetrics(sismoData.claims, sismoData.groups);
    // ZK proof for reputationScore (or modular metrics)
    const proofResult = await generateZKProof({
      reputationScore: sismoData.reputationScore,
      threshold,
      secret
    });
    res.json({
      ...metrics,
      reputationScore: sismoData.reputationScore,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch Sismo data or generate ZK proof' });
  }
});

module.exports = router;
