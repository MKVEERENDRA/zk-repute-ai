const express = require('express');
const router = express.Router();
const { fetchTelegramData, calculateReputationScore } = require('../services/telegramFetcher');
const { generateZKProof } = require('../../circuits/telegram/telegramScore.circom');

router.post('/telegram-reputation', async (req, res) => {
  try {
    const { userId, groupId, threshold = 100, secret = 12345 } = req.body;
    if (!userId || !groupId) return res.status(400).json({ error: 'User ID and Group ID are required' });

    const telegramData = await fetchTelegramData(userId, groupId, botInstance);
    const score = calculateReputationScore(telegramData);

    const proofResult = await generateZKProof({ score, threshold, secret });

    res.json({
      userId,
      groupId,
      score,
      threshold,
      proof: proofResult.proof,
      publicSignals: proofResult.publicSignals
    });
  } catch (err) {
    console.error('Telegram ZK proof error:', err);
    res.status(500).json({ error: 'Telegram ZK proof generation failed' });
  }
});

module.exports = router;
