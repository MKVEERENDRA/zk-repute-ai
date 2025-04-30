const axios = require('axios');

// Fetch Goldfinch credit desk data
async function fetchGoldfinchCreditDesk(poolAddress, apiKey) {
  const url = `https://api.goldfinch.finance/v1/creditdesk/${poolAddress}`;
  const headers = apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {};
  const response = await axios.get(url, { headers });
  return response.data || {};
}

// Fetch Goldfinch pool data
async function fetchGoldfinchPool(poolAddress, apiKey) {
  const url = `https://api.goldfinch.finance/v1/pool/${poolAddress}`;
  const headers = apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {};
  const response = await axios.get(url, { headers });
  return response.data || {};
}

// Normalize values to a common scale
function normalize(value, max) {
  return max === 0 ? 0 : value / max;
}

// Compute Goldfinch reputation score
async function calculateGoldfinchScore(poolAddress, apiKey) {
  const creditDesk = await fetchGoldfinchCreditDesk(poolAddress, apiKey);
  const pool = await fetchGoldfinchPool(poolAddress, apiKey);
  // Example metrics: totalBorrowed, totalRepaid, defaultRate, poolSize
  const weights = {
    totalBorrowed: 0.3,
    totalRepaid: 0.3,
    defaultRate: 0.2,
    poolSize: 0.2,
  };
  const totalBorrowed = parseFloat(creditDesk.totalBorrowed || 0);
  const totalRepaid = parseFloat(creditDesk.totalRepaid || 0);
  const defaultRate = parseFloat(creditDesk.defaultRate || 0);
  const poolSize = parseFloat(pool.poolSize || 0);
  const score =
    normalize(totalBorrowed, 10000000) * weights.totalBorrowed +
    normalize(totalRepaid, 10000000) * weights.totalRepaid +
    (1 - normalize(defaultRate, 1)) * weights.defaultRate + // lower is better
    normalize(poolSize, 10000000) * weights.poolSize;
  return {
    poolAddress,
    score: parseFloat(score.toFixed(2)),
    breakdown: {
      totalBorrowed,
      totalRepaid,
      defaultRate,
      poolSize,
      weights,
    },
  };
}

module.exports = {
  calculateGoldfinchScore,
  fetchGoldfinchCreditDesk,
  fetchGoldfinchPool,
  normalize,
};
