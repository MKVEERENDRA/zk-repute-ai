// backend/services/luxuryAssetFetcher.js
// Handles luxury asset input, normalization, and scoring for watches, jewelry, electronics, NFTs, etc.

function normalize(value, max) {
  return max === 0 ? 0 : value / max;
}

async function calculateLuxuryScore({ type, brand, value, serial, invoice, certificate }) {
  // Example weights: higher value, top brand, and strong proof
  const weights = {
    value: 0.5,
    brand: 0.2,
    proof: 0.3,
  };
  // Normalize value (max $1M)
  const normValue = normalize(value, 1000000);
  // Top brands for watches/jewelry/electronics
  const topBrands = [
    'Rolex','Cartier','Patek Philippe','Audemars Piguet','Van Cleef','Hermes','Omega',
    'Apple','Samsung','Sony','Microsoft','Canon','Nikon','Tiffany','BIS','Bulgari','PS5','PlayStation','Xbox','Nintendo'
  ];
  const brandScore = brand && topBrands.some(b => (brand || '').includes(b)) ? 1 : 0.7;
  // Proof: presence of invoice, serial, certificate, or NFT registry
  let proofScore = 0;
  if (invoice) proofScore += 0.4;
  if (serial) proofScore += 0.2;
  if (certificate) proofScore += 0.4;
  proofScore = Math.min(proofScore, 1);
  const score = normValue * weights.value + brandScore * weights.brand + proofScore * weights.proof;
  return { score: parseFloat(score.toFixed(2)), breakdown: { normValue, brandScore, proofScore, weights } };
}

module.exports = { calculateLuxuryScore };
