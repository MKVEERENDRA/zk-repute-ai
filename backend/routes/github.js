const express = require('express');
const router = express.Router();
const { fetchGithubData, calculateReputationScore } = require('../services/githubFetcher');
const { generateZKProof } = require('../../circuits/github/githubScore.circom');

// POST /api/github-reputation
router.post('/github-reputation', async (req, res) => {
  try {
    const { username, threshold = 100, secret = 12345 } = req.body;

    // Validate username
    if (!username) {
      return res.status(400).json({ error: 'GitHub username is required' });
    }

    // Step 1: Fetch GitHub data and calculate the reputation score
    const githubData = await fetchGithubData(username);

    // Step 2: Calculate the reputation score using various metrics
    const score = calculateReputationScore(githubData);

    // Step 3: Generate the ZK proof using the calculated score and provided threshold
    const proofResult = await generateZKProof({
      score,
      threshold,
      secret
    });

    // Step 4: Return the result with the proof, public signals, and score
    return res.json({
      username,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });

  } catch (err) {
    console.error('GitHub ZK proof error:', err);
    return res.status(500).json({ error: 'GitHub ZK proof generation failed' });
  }
});

module.exports = router;
