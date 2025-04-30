// backend/routes/creditScore.js
const express = require("express");
const router = express.Router();
const { fetchCreditScore } = require("../services/creditScore.service");
const { generateZKProof } = require('../../circuits/creditScore/creditScore.circom');

router.post("/credit-score", async (req, res) => {
  try {
    const { pan, name, dob, mobile, threshold = 750 } = req.body;
    const data = await fetchCreditScore({ pan, name, dob, mobile });
    // ZK proof generation for credit score
    const proofResult = await generateZKProof({
      creditScore: data.score,
      threshold
    });
    res.json({
      ...data,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch credit score or generate ZK proof", details: error.message });
  }
});

module.exports = router;
