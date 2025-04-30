// backend/services/propertyAssetFetcher.js
// Handles property/real estate asset input, normalization, and scoring

function normalize(value, max) {
  return max === 0 ? 0 : value / max;
}

async function calculatePropertyScore({ type, location, value, year }) {
  // Example weights: higher value, newer, and certain types (house, commercial) score higher
  const weights = {
    value: 0.5,
    year: 0.3,
    type: 0.2,
  };
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  // Normalize value (max $5M), age (max 50 years)
  const normValue = normalize(value, 5000000);
  const normAge = 1 - normalize(age, 50); // newer = higher score
  const typeScore = ['House','Commercial'].includes(type) ? 1 : 0.7;
  const score = normValue * weights.value + normAge * weights.year + typeScore * weights.type;
  return { score: parseFloat(score.toFixed(2)), breakdown: { normValue, normAge, typeScore, weights } };
}

module.exports = { calculatePropertyScore };
