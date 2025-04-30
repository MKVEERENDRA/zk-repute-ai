// routes/linkedin.js
const express = require('express');
const router = express.Router();
const { fetchLinkedInData, calculateLinkedInScore } = require('../services/linkedinFetcher');
const { generateZKProof } = require('../../circuits/linkedin/linkedinScore.circom');

// POST /api/linkedin-reputation
router.post('/linkedin-reputation', async (req, res) => {
  try {
    const { username, threshold = 100, secret = 12345 } = req.body;
    if (!username) return res.status(400).json({ error: 'LinkedIn username is required' });

    const linkedinData = await fetchLinkedInData(username);
    const score = calculateLinkedInScore(linkedinData);

    const proofResult = await generateZKProof({
      score,
      threshold,
      secret
    });

    res.json({
      username,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    console.error('LinkedIn ZK proof error:', err);
    res.status(500).json({ error: 'LinkedIn ZK proof generation failed' });
  }
});

module.exports = router;
