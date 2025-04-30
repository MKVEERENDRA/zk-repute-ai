// backend/services/bankAssetFetcher.js
// Handles bank balance and stablecoin input, normalization, and scoring

function normalize(value, max) {
  return max === 0 ? 0 : value / max;
}

async function calculateBankScore({ cash, stablecoins }) {
  // Example weights: liquid cash and stables
  const weights = {
    cash: 0.6,
    stablecoins: 0.4,
  };
  // Normalize (max $1M for each)
  const normCash = normalize(cash, 1000000);
  const normStables = normalize(stablecoins, 1000000);
  const score = normCash * weights.cash + normStables * weights.stablecoins;
  return { score: parseFloat(score.toFixed(2)), breakdown: { normCash, normStables, weights } };
}

module.exports = { calculateBankScore };
