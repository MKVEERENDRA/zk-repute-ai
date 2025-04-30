// services/upiScoreCalculator.js
function calculateUPIScore(transactions, balanceHistory) {
  const totalTxns = transactions.length;
  const totalVolume = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const txnFrequency = totalTxns / (balanceHistory.length || 1);

  const stableBalanceScore = balanceHistory.length > 0 ? 1 - (balanceHistory.filter(b => b < 500).length / balanceHistory.length) : 0;
  const recurringPatternScore = hasRecurringPatterns(transactions) ? 1 : 0;

  const score = Math.round(
    (0.3 * normalize(totalTxns, 0, 100)) +
    (0.3 * normalize(totalVolume, 0, 100000)) +
    (0.2 * normalize(txnFrequency, 0, 10)) +
    (0.1 * stableBalanceScore * 100) +
    (0.1 * recurringPatternScore * 100)
  );

  return score;
}

function normalize(value, min, max) {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

function hasRecurringPatterns(transactions) {
  const recurring = {};
  transactions.forEach(txn => {
    const key = `${txn.to}-${txn.amount}`;
    recurring[key] = (recurring[key] || 0) + 1;
  });
  return Object.values(recurring).some(count => count >= 3);
}

module.exports = { calculateUPIScore };

