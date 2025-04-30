const axios = require('axios');

// Fetch Cred Protocol Score
async function fetchCredScore(address, accessToken) {
  const response = await axios.get(
    `https://beta.credprotocol.com/api/score/address/${address}`,
    {
      headers: { Authorization: `Token ${accessToken}` },
    }
  );
  return response.data || {};
}

// Fetch Asset Breakdown
async function fetchAssetBreakdown(address, accessToken) {
  const response = await axios.get(
    `https://beta.credprotocol.com/api/asset/address/${address}`,
    {
      headers: { Authorization: `Token ${accessToken}` },
    }
  );
  return response.data || {};
}

// Fetch Sanction Status
async function fetchSanctionStatus(address, accessToken) {
  const response = await axios.get(
    `https://beta.credprotocol.com/api/sanction/address/${address}`,
    {
      headers: { Authorization: `Token ${accessToken}` },
    }
  );
  return response.data || {};
}

// Fetch Similar Accounts
async function fetchSimilarAccounts(address, accessToken) {
  const response = await axios.get(
    `https://beta.credprotocol.com/api/similarity/address/${address}`,
    {
      headers: { Authorization: `Token ${accessToken}` },
    }
  );
  return response.data || {};
}

// Normalize values to a common scale
function normalize(value, max) {
  return max === 0 ? 0 : value / max;
}

// Calculate combined Cred-based reputation score
async function calculateCredScore(address, accessToken) {
  // Fetch basic Cred score
  const credScore = await fetchCredScore(address, accessToken);
  // Fetch asset breakdown
  const assetBreakdown = await fetchAssetBreakdown(address, accessToken);
  // Fetch sanction status
  const sanctionStatus = await fetchSanctionStatus(address, accessToken);
  // Fetch similar accounts
  const similarAccounts = await fetchSimilarAccounts(address, accessToken);
  // Define weights for each metric
  const weights = {
    credValue: 0.4,
    debtToCollateral: 0.1,
    liquidationCount: 0.1,
    sanctionPenalty: 0.1,
    similarityScore: 0.1,
    assetDiversity: 0.1,
    depositUsd: 0.1,
  };
  // Extract metrics
  const totalAssets = parseFloat(assetBreakdown.total?.reduce((sum, item) => sum + parseFloat(item.asset || 0), 0) || 0);
  const debtToCollateralRatio = parseFloat(credScore.summary?.debt_to_collateral_ratio || 0);
  const liquidationCount = parseFloat(credScore.summary?.liquidation_count || 0);
  const isSanctioned = sanctionStatus.is_sanctioned || false;
  const similarAccountCount = similarAccounts.similar_accounts?.length || 0;
  const assetDiversity = assetBreakdown.symbols?.length || 0;
  const depositUsd = parseFloat(assetBreakdown.deposit_usd || 0);
  // Calculate weighted score
  const score =
    normalize(credScore.value || 0, 1000) * weights.credValue +
    normalize(debtToCollateralRatio, 1) * weights.debtToCollateral +
    normalize(liquidationCount, 10) * weights.liquidationCount +
    normalize(isSanctioned ? 0 : 1, 1) * weights.sanctionPenalty +
    normalize(similarAccountCount, 10) * weights.similarityScore +
    normalize(assetDiversity, 50) * weights.assetDiversity +
    normalize(depositUsd, 100000) * weights.depositUsd;
  // Return final score and breakdown
  return {
    wallet: address,
    score: parseFloat(score.toFixed(2)),
    breakdown: {
      credValue: credScore.value || 0,
      debtToCollateralRatio,
      liquidationCount,
      isSanctioned,
      similarAccountCount,
      assetDiversity,
      depositUsd,
      weights,
    },
  };
}

module.exports = {
  calculateCredScore,
  fetchCredScore,
  fetchAssetBreakdown,
  fetchSanctionStatus,
  fetchSimilarAccounts,
  normalize,
};
