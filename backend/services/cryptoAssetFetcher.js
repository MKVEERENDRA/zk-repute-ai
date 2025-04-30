// backend/services/cryptoAssetFetcher.js
// Handles on-chain crypto asset input, normalization, and scoring
const { getWalletNetWorth, getProtocolsUsed } = require('./onChainFetcher');

function normalize(value, max) {
  return max === 0 ? 0 : value / max;
}

async function calculateCryptoScore({ wallet }) {
  // Use onChainFetcher helpers to get net worth and protocol count
  const netWorth = await getWalletNetWorth(wallet); // e.g., in USD
  const protocolsUsed = await getProtocolsUsed(wallet); // array
  // Example weights
  const weights = {
    netWorth: 0.7,
    protocols: 0.3,
  };
  // Normalize net worth (max $10M), protocol diversity (max 50)
  const normWorth = normalize(netWorth, 10000000);
  const normProtocols = normalize(protocolsUsed.length, 50);
  const score = normWorth * weights.netWorth + normProtocols * weights.protocols;
  return { score: parseFloat(score.toFixed(2)), breakdown: { normWorth, normProtocols, weights } };
}

module.exports = { calculateCryptoScore };
