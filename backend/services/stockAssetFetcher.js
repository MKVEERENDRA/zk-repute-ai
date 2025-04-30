// backend/services/stockAssetFetcher.js
// Handles stocks/mutual funds input, normalization, and scoring

function normalize(value, max) {
  return max === 0 ? 0 : value / max;
}

async function calculateStockScore({ value, broker }) {
  // Example weights: higher value and known brokers score higher
  const weights = {
    value: 0.8,
    broker: 0.2,
  };
  // Normalize value (max $2M)
  const normValue = normalize(value, 2000000);
  // Known brokers (Zerodha, Groww, ICICI, etc.)
  const knownBrokers = ['Zerodha','Groww','ICICI','Upstox','Angel','HDFC'];
  const brokerScore = knownBrokers.some(b => (broker || '').includes(b)) ? 1 : 0.7;
  const score = normValue * weights.value + brokerScore * weights.broker;
  return { score: parseFloat(score.toFixed(2)), breakdown: { normValue, brokerScore, weights } };
}

module.exports = { calculateStockScore };
