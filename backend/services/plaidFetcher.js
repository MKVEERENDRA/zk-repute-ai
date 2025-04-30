// backend/services/plaidFetcher.js
const axios = require('axios');

/**
 * Fetch Plaid transactions for a user (requires valid access_token)
 * @param {string} accessToken
 * @param {string} startDate (YYYY-MM-DD)
 * @param {string} endDate (YYYY-MM-DD)
 * @returns {Promise<object[]>}
 */
async function fetchPlaidTransactions(accessToken, startDate, endDate) {
  const plaidUrl = 'https://sandbox.plaid.com/transactions/get';
  const body = {
    access_token: accessToken,
    start_date: startDate,
    end_date: endDate,
  };
  try {
    const res = await axios.post(plaidUrl, body, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data.transactions;
  } catch (err) {
    console.error('Plaid API error:', err.response?.data || err.message);
    throw new Error('Failed to fetch Plaid transactions');
  }
}

/**
 * Normalize and compute a US financial reputation score
 * @param {object} metrics - { fico, loanRepayment, utilization, volume }
 * @returns {number}
 */
function normalize(val, min, max) {
  return (val - min) / (max - min);
}

function computeUSReputationScore({ fico, loanRepayment, utilization, volume }) {
  const weights = { fico: 0.4, loan: 0.3, util: 0.2, volume: 0.1 };
  return (
    normalize(fico, 300, 850) * weights.fico +
    (loanRepayment / 100) * weights.loan +
    (1 - utilization / 100) * weights.util +
    normalize(volume, 0, 100000) * weights.volume
  );
}

module.exports = {
  fetchPlaidTransactions,
  computeUSReputationScore,
  normalize
};
