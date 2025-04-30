// backend/routes/ageProof.js
const express = require('express');
const router = express.Router();
const { fetchUserDOB } = require('../services/ageProof.service');
const { generateZKProof } = require('../../circuits/ageProof/ageOver18.circom');

// POST /api/age-proof
router.post('/age-proof', async (req, res) => {
  try {
    const { pan, name, dob, mobile, today } = req.body;
    // today: optional, for testing; else use current date
    const { dobTimestamp } = await fetchUserDOB({ pan, name, dob, mobile });
    const todayTimestamp = today
      ? Math.floor(new Date(today).getTime() / (1000 * 60 * 60 * 24))
      : Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    // ZK proof: prove dob <= today - (18*365)
    const proofResult = await generateZKProof({
      dob: dobTimestamp,
      today: todayTimestamp
    });
    res.json({
      dobTimestamp,
      todayTimestamp,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate age proof', details: error.message });
  }
});

module.exports = router;
