const express = require('express');
const router = express.Router();
const { fetchDiscordData, calculateDiscordScore } = require('../services/discordFetcher');
const { generateZKProof } = require('../../circuits/discord/discordScore.circom');

router.post('/discord-reputation', async (req, res) => {
  try {
    const { userId, servers, threshold = 50, secret = 12345 } = req.body;
    if (!userId || !servers) return res.status(400).json({ error: 'User ID and server list required' });

    const discordData = await fetchDiscordData(userId, servers);
    const score = calculateDiscordScore(discordData);

    const proofResult = await generateZKProof({
      score,
      threshold,
      secret
    });

    res.json({
      userId,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    console.error('Discord ZK proof error:', err);
    res.status(500).json({ error: 'Discord ZK proof generation failed.' });
  }
});

module.exports = router;
