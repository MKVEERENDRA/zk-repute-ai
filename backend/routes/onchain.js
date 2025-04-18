import express from 'express';
import onChainFetcher from '../services/onChainFetcher.js';

const router = express.Router();

// Util: very basic scoring (replace with real logic)
function scoreOnChainActivity(data) {
  // Example: more ERC20 transfers + ETH txns + contract interactions = higher score
  const erc20Count = data.erc20.length;
  const ethCount = data.eth.length;
  const contractCount = data.contract.length;
  const nftCount = data.nft.length;
  // Simple weighted sum (max 100)
  let score = erc20Count * 2 + ethCount * 1 + contractCount * 3 + nftCount * 2;
  score = Math.min(score, 100);
  return { reputeX: score };
}

// GET /api/onchain/:wallet — raw on-chain data
router.get('/:wallet', async (req, res) => {
  try {
    const data = await onChainFetcher(req.params.wallet);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/onchain/:wallet/score — computed score
router.get('/:wallet/score', async (req, res) => {
  try {
    const data = await onChainFetcher(req.params.wallet);
    const score = scoreOnChainActivity(data);
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
