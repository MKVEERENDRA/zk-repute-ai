const express = require('express');
const router = express.Router();
const { fetchLensData, calculateLensScore } = require('../services/lensFetcher');
const { generateZKProof } = require('../../circuits/lens/lensScore.circom');

router.post('/lens-reputation', async (req, res) => {
  try {
    const { handle, threshold = 100, secret = 12345 } = req.body;
    if (!handle) return res.status(400).json({ error: 'Lens handle is required' });

    const lensData = await fetchLensData(handle);
    const score = calculateLensScore(lensData);

    const proofResult = await generateZKProof({
      score,
      threshold,
      secret
    });

    res.json({
      handle,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });

  } catch (err) {
    console.error('Lens ZK proof error:', err);
    res.status(500).json({ error: 'Lens ZK proof generation failed' });
  }
});

module.exports = router;
