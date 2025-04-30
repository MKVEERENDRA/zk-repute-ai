import express from 'express';
import onChainFetcher from '../services/onChainFetcher.js';
import path from 'path';
import { generateProofAndSignals } from '../../circuits/onchain/onchainScore.circom';

const router = express.Router();

// Util: very basic scoring (replace with real logic)
function scoreOnChainActivity(data) {
  // Example: more ERC20 transfers + ETH txns + contract interactions = higher score
  const erc20Count = data.erc20.length;
  const ethCount = data.eth.length;
  const contractCount = data.contract.length;
  const nftCount = data.nft.length;
  // Simple weighted sum (max 100)
  let score = (erc20Count * 2 + ethCount * 1 + contractCount * 3 + nftCount * 2) / 100;
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

// POST /api/onchain/score
router.post('/score', async (req, res) => {
  try {
    const { wallet, threshold = 0.5, secret = 12345 } = req.body;
    if (!wallet) return res.status(400).json({ error: 'Missing wallet address' });
    // 1. Fetch on-chain metrics
    const metrics = await onChainFetcher(wallet);
    // 2. Example: composite score (simple average of select metrics, customize as needed)
    const score = (
      (metrics.txCount / 1000) * 0.2 +
      (metrics.tokenDiversity / 100) * 0.2 +
      (metrics.gasSpent / 10) * 0.2 +
      (metrics.liquidity / 1000) * 0.2 +
      (metrics.walletVintageScore / 10) * 0.2
    );
    // 3. Generate ZK proof for score >= threshold using circom compiled artifacts
    const circuitWasmPath = path.resolve(__dirname, '../../circuits/onchain/onchainScore_js/onchainScore.wasm');
    const zkeyPath = path.resolve(__dirname, '../../circuits/onchain/onchainScore_final.zkey');
    const input = {
      score: Math.round(score * 1000),
      threshold: Math.round(threshold * 1000),
      secret
    };
    const { proof, publicSignals } = await generateProofAndSignals(input, circuitWasmPath, zkeyPath);
    res.json({
      wallet,
      score,
      threshold,
      metrics,
      proof,
      publicSignals
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute on-chain score or generate ZK proof' });
  }
});

export default router;
