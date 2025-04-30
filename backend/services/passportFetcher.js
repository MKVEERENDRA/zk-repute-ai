// backend/services/passportFetcher.js
import axios from 'axios';

/**
 * Fetch Passport.xyz score and metrics for a given scorerId and walletAddress
 * @param {string} scorerId
 * @param {string} walletAddress
 * @returns {Promise<{score: number, metrics: object}>}
 */
export async function fetchPassportScore(scorerId, walletAddress) {
  const apiUrl = `https://api.passport.xyz/v2/stamps/${scorerId}/score/${walletAddress}`;
  try {
    const { data } = await axios.get(apiUrl);
    // Assume data = { score, metrics: { ... } }
    return {
      score: data.score,
      metrics: data.metrics || {},
      // Modular metric breakdown (if available)
      stamps: data.stamps || [],
      lastUpdated: data.lastUpdated || null
    };
  } catch (err) {
    console.error('Passport.xyz API error:', err.message);
    throw new Error('Failed to fetch Passport.xyz score');
  }
}

/**
 * Modular function to extract useful metrics (for ZK proof or UI)
 * @param {object} metrics
 * @returns {object}
 */
export function extractPassportMetrics(metrics) {
  // Example: count of unique stamps, diversity, recency, etc.
  const totalStamps = Array.isArray(metrics.stamps) ? metrics.stamps.length : 0;
  const diversity = metrics.stamps ? new Set(metrics.stamps.map(s => s.provider)).size : 0;
  // Add other modular breakdowns as needed
  return {
    totalStamps,
    diversity,
    // ...add more as Passport API evolves
  };
}
