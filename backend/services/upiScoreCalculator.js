// backend/services/upiScoreCalculator.js
// Modular UPI score calculation for ZK reputation

function calculateUPIScore({ transactions, balanceHistory }) {
  const totalTxns = transactions.length;
  const totalVolume = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const txnFrequency = totalTxns / (balanceHistory.length || 1);

  const stableBalanceScore = balanceHistory.length > 0 ? 1 - (balanceHistory.filter(b => b < 500).length / balanceHistory.length) : 0;
  const recurringPatternScore = hasRecurringPatterns(transactions) ? 1 : 0;

  return {
    totalTxns,
    totalVolume,
    txnFrequency,
    stableBalanceScore,
    recurringPatternScore
  };
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
