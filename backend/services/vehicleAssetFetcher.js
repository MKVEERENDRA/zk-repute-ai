// backend/services/vehicleAssetFetcher.js
// Handles vehicle asset input, normalization, and scoring

function normalize(value, max) {
  return max === 0 ? 0 : value / max;
}

async function calculateVehicleScore({ type, model, age, value }) {
  // Example weights: newer, higher value, and certain types score higher
  const weights = {
    value: 0.5,
    age: 0.3,
    type: 0.2,
  };
  // Normalize value (max $200k), age (max 30 years)
  const normValue = normalize(value, 200000);
  const normAge = 1 - normalize(age, 30); // newer = higher score
  const typeScore = ['Car','Yacht','Truck'].includes(type) ? 1 : 0.7;
  const score = normValue * weights.value + normAge * weights.age + typeScore * weights.type;
  return { score: parseFloat(score.toFixed(2)), breakdown: { normValue, normAge, typeScore, weights } };
}

module.exports = { calculateVehicleScore };
