// backend/services/polygonIdFetcher.js
import axios from 'axios';

/**
 * Fetch Polygon ID credentials for a user address
 * @param {string} address
 * @returns {Promise<{credentials: object[]}>}
 */
export async function fetchPolygonIdCredentials(address) {
  const apiUrl = `https://api.polygonid.com/v1/users/${address}/credentials`;
  try {
    const { data } = await axios.get(apiUrl);
    // Assume data = { credentials: [ ... ] }
    return {
      credentials: data.credentials || []
    };
  } catch (err) {
    console.error('Polygon ID API error:', err.message);
    throw new Error('Failed to fetch Polygon ID credentials');
  }
}

/**
 * Compute modular Polygon ID metrics and score
 * @param {object[]} credentials
 * @returns {object}
 */
export function extractPolygonIdMetrics(credentials) {
  const now = Date.now();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  const numCredentials = credentials.length;
  const normalizedCount = Math.min(Math.round((numCredentials / 20) * 100), 100); // max 20

  // Types of credentials
  const typeWeights = {
    'KYC Verified': 10,
    'Resident of India': 5,
    'Education Verified': 7
    // Add more as needed
  };
  let typeScore = 0;
  let latestTimestamp = 0;
  credentials.forEach(cred => {
    if (typeWeights[cred.type]) typeScore += typeWeights[cred.type];
    if (cred.issuedAt && cred.issuedAt > latestTimestamp) latestTimestamp = cred.issuedAt;
  });

  // Recency penalty: subtract if latest credential is older than 1 year
  let recencyPenalty = 0;
  if (latestTimestamp && now - latestTimestamp > oneYearMs) {
    recencyPenalty = 10;
  }

  const score = Math.max(0, normalizedCount + typeScore - recencyPenalty);

  return {
    numCredentials,
    normalizedCount,
    typeScore,
    latestTimestamp,
    recencyPenalty,
    score
  };
}
