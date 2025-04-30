// backend/routes/plaid.js
const express = require('express');
const router = express.Router();
const { fetchPlaidTransactions, computeUSReputationScore } = require('../services/plaidFetcher');
const { generateZKProof } = require('../../circuits/plaid/plaidScore.circom');

// POST /api/plaid/score
router.post('/score', async (req, res) => {
  try {
    const { accessToken, startDate, endDate, fico = 700, loanRepayment = 100, utilization = 30, threshold = 0.7, secret = 12345 } = req.body;
    if (!accessToken || !startDate || !endDate) return res.status(400).json({ error: 'Missing required fields' });
    // 1. Fetch Plaid transactions
    const transactions = await fetchPlaidTransactions(accessToken, startDate, endDate);
    // 2. Compute transaction volume
    const volume = transactions.reduce((sum, txn) => sum + Math.abs(txn.amount), 0);
    // 3. Compute modular score
    const score = computeUSReputationScore({ fico, loanRepayment, utilization, volume });
    // 4. Generate ZK proof for normalized score
    const proofResult = await generateZKProof({
      score,
      threshold,
      secret
    });
    res.json({
      fico,
      loanRepayment,
      utilization,
      volume,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute Plaid score or generate ZK proof' });
  }
});

module.exports = router;
