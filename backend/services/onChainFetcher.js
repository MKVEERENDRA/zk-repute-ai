const axios = require('axios');
const moment = require('moment');

function extractValue(data, key, defaultValue = 0) {
  return data && data[key] ? parseFloat(data[key]) : defaultValue;
}

async function getOnchainData(wallet) {
  const COVALENT_API_KEY = process.env.COVALENT_API_KEY;
  const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

  const txResponse = await axios.get(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&apikey=${ETHERSCAN_API_KEY}`
  );
  const transactions = txResponse.data.result || [];
  const txCount = transactions.length;
  const activeDaysSet = new Set(transactions.map((tx) => moment.unix(tx.timeStamp).format('YYYY-MM-DD')));
  const activeDays = activeDaysSet.size;
  const weeklyActivityStreak = calculateWeeklyStreak(activeDaysSet);
  const gapDays = calculateGapDays(activeDaysSet);
  const gasSpent = transactions.reduce(
    (total, tx) => total + (parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice)) / 1e18,
    0
  );
  const covalentResponse = await axios.get(
    `https://api.covalenthq.com/v1/1/address/${wallet}/balances_v2/?key=${COVALENT_API_KEY}`
  );
  const tokens = covalentResponse.data.data?.items || [];
  const tvl = tokens.reduce((sum, token) => sum + parseFloat(token.quote || 0), 0);
  const tokenDiversity = tokens.length;
  const longHoldings = calculateLongHoldings(tokens);
  const avgHoldingDuration = calculateAvgHoldingDuration(tokens);
  const maxHoldDuration = calculateMaxHoldDuration(tokens);
  const diamondHandsScore = calculateDiamondHandsScore(tokens);
  const liquidity = await fetchLiquidity(wallet);
  const lending = await fetchLending(wallet);
  const staking = await fetchStaking(wallet);
  const dominantProtocolRatio = calculateDominantProtocolRatio(liquidity, lending, staking);
  const multiProtocolWeight = calculateMultiProtocolWeight(liquidity, lending, staking);
  const stakingPersistence = calculateStakingPersistence(staking);
  const blueChipRatio = calculateBlueChipRatio(tokens, tokenDiversity);
  const riskyAssetRatio = calculateRiskyAssetRatio(tokens, tokenDiversity);
  const reputationTransferWeight = calculateReputationTransferWeight(transactions, txCount);
  const sybilProximityScore = calculateSybilProximityScore(transactions, txCount);
  const anonInteractionRatio = calculateAnonInteractionRatio(transactions, txCount);
  const firstTxTime = moment.unix(transactions[transactions.length - 1]?.timeStamp || 0);
  const daysSinceFirstTx = moment().diff(firstTxTime, 'days');
  const walletVintageScore = calculateWalletVintageScore(daysSinceFirstTx, tokenDiversity, gasSpent, longHoldings);
  const monthlyScoreTrend = await fetchMonthlyScoreTrend(wallet);
  const last30vsPrev30 = calculateLast30vsPrev30(monthlyScoreTrend);
  const recoveryScore = calculateRecoveryScore(monthlyScoreTrend);
  const sequenceEntropy = calculateSequenceEntropy(transactions);
  const feeDiversity = calculateFeeDiversity(transactions);

  return {
    txCount,
    activeDays,
    gasSpent,
    tvl,
    tokenDiversity,
    longHoldings,
    avgHoldingDuration,
    maxHoldDuration,
    diamondHandsScore,
    weeklyActivityStreak,
    gapDays,
    liquidity,
    lending,
    staking,
    dominantProtocolRatio,
    multiProtocolWeight,
    stakingPersistence,
    blueChipRatio,
    riskyAssetRatio,
    reputationTransferWeight,
    sybilProximityScore,
    anonInteractionRatio,
    daysSinceFirstTx,
    walletVintageScore,
    monthlyScoreTrend,
    last30vsPrev30,
    recoveryScore,
    sequenceEntropy,
    feeDiversity,
  };
}

function calculateWeeklyStreak(activeDaysSet) {
  const sortedDates = Array.from(activeDaysSet).sort();
  let streak = 0;
  let currentStreak = 0;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const currentDate = moment(sortedDates[i], 'YYYY-MM-DD');
    const nextDate = moment(sortedDates[i + 1], 'YYYY-MM-DD');
    if (nextDate.diff(currentDate, 'weeks') <= 1) {
      currentStreak++;
    } else {
      streak = Math.max(streak, currentStreak);
      currentStreak = 0;
    }
  }
  return Math.max(streak, currentStreak);
}

function calculateGapDays(activeDaysSet) {
  const sortedDates = Array.from(activeDaysSet).sort();
  const gaps = [];
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const currentDate = moment(sortedDates[i], 'YYYY-MM-DD');
    const nextDate = moment(sortedDates[i + 1], 'YYYY-MM-DD');
    gaps.push(nextDate.diff(currentDate, 'days'));
  }
  return gaps.length > 0 ? Math.max(...gaps) : 0;
}

function calculateLongHoldings(tokens) {
  return tokens.filter((token) => {
    const lastUpdated = moment(token.updated_at);
    return moment().diff(lastUpdated, 'months') > 6;
  }).length;
}

function calculateAvgHoldingDuration(tokens) {
  const durations = tokens
    .filter((token) => token.updated_at)
    .map((token) => moment().diff(moment(token.updated_at), 'days'));
  return durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
}

function calculateMaxHoldDuration(tokens) {
  const durations = tokens
    .filter((token) => token.updated_at)
    .map((token) => moment().diff(moment(token.updated_at), 'days'));
  return durations.length > 0 ? Math.max(...durations) : 0;
}

function calculateDiamondHandsScore(tokens) {
  return tokens.filter((token) => {
    const lastUpdated = moment(token.updated_at);
    return moment().diff(lastUpdated, 'months') > 6;
  }).length;
}

async function fetchLiquidity(wallet) {
  const response = await axios.post(
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    {
      query: `
        query($wallet: String!) {
          liquidityPositions(where: { user: $wallet }) {
            liquidityTokenBalance
          }
        }
      `,
      variables: { wallet },
    }
  );
  return response.data.data?.liquidityPositions.reduce(
    (sum, pos) => sum + parseFloat(pos.liquidityTokenBalance || 0),
    0
  );
}

async function fetchLending(wallet) {
  const response = await axios.post(
    'https://api.thegraph.com/subgraphs/name/aave/protocol-v2',
    {
      query: `
        query($wallet: String!) {
          deposits(where: { user: $wallet }) {
            amountUSD
          }
        }
      `,
      variables: { wallet },
    }
  );
  return response.data.data?.deposits.reduce(
    (sum, deposit) => sum + parseFloat(deposit.amountUSD || 0),
    0
  );
}

async function fetchStaking(wallet) {
  const response = await axios.get(`https://beaconcha.in/api/v1/validator/eth1/${wallet}`);
  return response.data?.data?.balance || 0;
}

function calculateDominantProtocolRatio(liquidity, lending, staking) {
  const totalActivity = liquidity + lending + staking;
  if (totalActivity === 0) return 0;
  const maxActivity = Math.max(liquidity, lending, staking);
  return maxActivity / totalActivity;
}

function calculateMultiProtocolWeight(liquidity, lending, staking) {
  const protocolsUsed = [liquidity, lending, staking].filter((val) => val > 0).length;
  return protocolsUsed > 3 ? 1 : protocolsUsed / 3;
}

function calculateStakingPersistence(staking) {
  return staking > 0 ? Math.min(staking / 1e6, 1) : 0;
}

function calculateBlueChipRatio(tokens, tokenDiversity) {
  const blueChips = tokens.filter((token) => token.isBlueChip).length;
  return tokenDiversity > 0 ? blueChips / tokenDiversity : 0;
}

function calculateRiskyAssetRatio(tokens, tokenDiversity) {
  const riskyAssets = tokens.filter((token) => token.isRisky).length;
  return tokenDiversity > 0 ? riskyAssets / tokenDiversity : 0;
}

function calculateReputationTransferWeight(transactions, txCount) {
  const reputableAddresses = ['0xReputableDAO', '0xTrustedPool'];
  const reputableTransfers = transactions.filter((tx) =>
    reputableAddresses.includes(tx.to) || reputableAddresses.includes(tx.from)
  ).length;
  return txCount > 0 ? reputableTransfers / txCount : 0;
}

function calculateSybilProximityScore(transactions, txCount) {
  const lowScoreAddresses = ['0xSybilAddress1', '0xSybilAddress2'];
  const sybilInteractions = transactions.filter((tx) =>
    lowScoreAddresses.includes(tx.to) || lowScoreAddresses.includes(tx.from)
  ).length;
  return txCount > 0 ? sybilInteractions / txCount : 0;
}

function calculateAnonInteractionRatio(transactions, txCount) {
  const unlabeledAddresses = transactions.filter((tx) => !tx.to || !tx.from).length;
  return txCount > 0 ? unlabeledAddresses / txCount : 0;
}

function calculateWalletVintageScore(daysSinceFirstTx, tokenDiversity, gasSpent, longHoldings) {
  return (daysSinceFirstTx / 365) + (tokenDiversity / 50) + (gasSpent / 10) + (longHoldings / 12);
}

async function fetchMonthlyScoreTrend(wallet) {
  return [
    { month: '2023-01', score: 70 },
    { month: '2023-02', score: 75 },
    { month: '2023-03', score: 80 },
    { month: '2023-04', score: 85 },
  ];
}

function calculateLast30vsPrev30(trend) {
  const recentScores = trend.slice(-2);
  return recentScores[1].score - recentScores[0].score;
}

function calculateRecoveryScore(trend) {
  const recentScores = trend.slice(-2);
  return Math.max(recentScores[1].score - recentScores[0].score, 0);
}

function calculateSequenceEntropy(transactions) {
  const sequences = transactions.map((tx) => `${tx.to}-${tx.value}-${tx.gasUsed}`);
  const entropy = [...new Set(sequences)].length / transactions.length;
  return entropy;
}

function calculateFeeDiversity(transactions) {
  const fees = transactions.map((tx) => parseFloat(tx.gasPrice)).filter((fee) => fee > 0);
  const uniqueFees = new Set(fees).size;
  return fees.length > 0 ? uniqueFees / fees.length : 0;
}

module.exports = { getOnchainData };