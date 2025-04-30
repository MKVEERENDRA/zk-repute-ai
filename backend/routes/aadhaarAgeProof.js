// backend/routes/aadhaarAgeProof.js
const express = require('express');
const router = express.Router();
const { fetchAadhaarDOB, isEighteenPlus } = require('../services/aadhaarAgeProof.service');
const { generateZKProof } = require('../../circuits/ageProof/ageOver18.circom'); // Reuse ZK circuit for age proof

// POST /api/aadhaar-age-proof
router.post('/aadhaar-age-proof', async (req, res) => {
  try {
    // Accepts: { aadhaarData: { dob: 'YYYY-MM-DD' }, today?: 'YYYY-MM-DD' }
    const { aadhaarData, today } = req.body;
    const { dobTimestamp } = await fetchAadhaarDOB(aadhaarData);
    const todayTimestamp = today
      ? Math.floor(new Date(today).getTime() / (1000 * 60 * 60 * 24))
      : Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    // Only return if user is 18+
    const is18Plus = isEighteenPlus(dobTimestamp, todayTimestamp);
    // Privacy: do NOT return dob, Aadhaar number, or any PII
    // Optionally, generate a ZK proof of age >= 18
    const proofResult = await generateZKProof({
      dob: dobTimestamp,
      today: todayTimestamp
    });
    res.json({
      is18Plus,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to verify Aadhaar age', details: error.message });
  }
});

module.exports = router;
