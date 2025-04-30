const axios = require('axios');

// Fetch Centrifuge pool data via The Graph
async function fetchCentrifugePool(poolId) {
  const url = 'https://gateway.thegraph.com/api/[YOUR_GRAPH_API_KEY]/subgraphs/id/centrifuge-mainnet';
  const query = `{
    pool(id: "${poolId}") {
      id
      totalAssets
      totalBorrowed
      totalRepaid
      defaultRate
      investorCount
      loanCount
    }
  }`;
  const response = await axios.post(url, { query });
  return response.data.data.pool || {};
}

// Normalize values to a common scale
function normalize(value, max) {
  return max === 0 ? 0 : value / max;
}

// Compute Centrifuge reputation score
async function calculateCentrifugeScore(poolId) {
  const pool = await fetchCentrifugePool(poolId);
  const weights = {
    totalAssets: 0.3,
    totalBorrowed: 0.2,
    totalRepaid: 0.2,
    defaultRate: 0.1,
    investorCount: 0.1,
    loanCount: 0.1,
  };
  const totalAssets = parseFloat(pool.totalAssets || 0);
  const totalBorrowed = parseFloat(pool.totalBorrowed || 0);
  const totalRepaid = parseFloat(pool.totalRepaid || 0);
  const defaultRate = parseFloat(pool.defaultRate || 0);
  const investorCount = parseFloat(pool.investorCount || 0);
  const loanCount = parseFloat(pool.loanCount || 0);
  const score =
    normalize(totalAssets, 10000000) * weights.totalAssets +
    normalize(totalBorrowed, 10000000) * weights.totalBorrowed +
    normalize(totalRepaid, 10000000) * weights.totalRepaid +
    (1 - normalize(defaultRate, 1)) * weights.defaultRate +
    normalize(investorCount, 1000) * weights.investorCount +
    normalize(loanCount, 1000) * weights.loanCount;
  return {
    poolId,
    score: parseFloat(score.toFixed(2)),
    breakdown: {
      totalAssets,
      totalBorrowed,
      totalRepaid,
      defaultRate,
      investorCount,
      loanCount,
      weights,
    },
  };
}

module.exports = {
  calculateCentrifugeScore,
  fetchCentrifugePool,
  normalize,
};
