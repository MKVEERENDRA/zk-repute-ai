// backend/services/sismoFetcher.js
import axios from 'axios';

/**
 * Fetch Sismo user data: claims, groups, and reputation
 * @param {string} addressOrId
 * @returns {Promise<{claims: object[], groups: object[], reputationScore: number, raw: object}>}
 */
export async function fetchSismoData(addressOrId) {
  const apiUrl = `https://public-api.sismo.io/v1/users/${addressOrId}`;
  try {
    const { data } = await axios.get(apiUrl);
    // Example structure: { claims: [], groups: [], reputationScore: ... }
    return {
      claims: data.claims || [],
      groups: data.groups || [],
      reputationScore: data.reputationScore || 0,
      raw: data
    };
  } catch (err) {
    console.error('Sismo API error:', err.message);
    throw new Error('Failed to fetch Sismo data');
  }
}

/**
 * Extract modular metrics for Sismo reputation
 * @param {object[]} claims
 * @param {object[]} groups
 * @returns {object}
 */
export function extractSismoMetrics(claims, groups) {
  const totalClaims = claims.length;
  const totalGroups = groups.length;
  const uniqueGroupTypes = new Set(groups.map(g => g.type)).size;
  // Add more as Sismo API evolves
  return {
    totalClaims,
    totalGroups,
    uniqueGroupTypes
  };
}
