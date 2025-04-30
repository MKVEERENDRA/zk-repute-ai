// backend/routes/polygonId.js
const express = require('express');
const router = express.Router();
const { fetchPolygonIdCredentials, extractPolygonIdMetrics } = require('../services/polygonIdFetcher');
const { generateZKProof } = require('../../circuits/polygonId/polygonIdScore.circom');

// POST /api/polygonid/score
router.post('/score', async (req, res) => {
  try {
    const { address, threshold = 50, secret = 12345 } = req.body;
    if (!address) return res.status(400).json({ error: 'address required' });
    const { credentials } = await fetchPolygonIdCredentials(address);
    const metrics = extractPolygonIdMetrics(credentials);
    // ZK proof for modular score
    const proofResult = await generateZKProof({
      score: metrics.score,
      threshold,
      secret
    });
    res.json({
      ...metrics,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch Polygon ID data or generate ZK proof' });
  }
});

module.exports = router;
