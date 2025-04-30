// mirrorScore.route.js
const express = require('express');
const router = express.Router();
const { fetchMirrorData, calculateMirrorScore } = require('../services/mirrorParagraphFetcher');
const { generateZKProof } = require('../../circuits/mirrorParagraph/mirrorParagraphScore.circom');

// POST /api/mirror-reputation
router.post('/mirror-reputation', async (req, res) => {
  try {
    const { addressOrHandle, threshold = 100, secret = 12345 } = req.body;
    if (!addressOrHandle) return res.status(400).json({ error: 'Address or handle required' });

    const mirrorData = await fetchMirrorData(addressOrHandle);
    const score = calculateMirrorScore(mirrorData);

    const proofResult = await generateZKProof({
      score,
      threshold,
      secret
    });

    return res.json({
      addressOrHandle,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    console.error('Mirror ZK proof error:', err);
    return res.status(500).json({ error: 'Mirror ZK proof generation failed' });
  }
});

module.exports = router;
