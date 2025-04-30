// backend/services/aadhaarAgeProof.service.js
// Anonymous Aadhaar-based age proof (no identity, only age >= 18 check)
// This mock implementation expects an Aadhaar offline XML/JWT/QR or ZK proof as input
// In production, integrate with UIDAI's offline Aadhaar verification or a ZK circuit

/**
 * Extracts DOB from Aadhaar XML/JWT (mocked here)
 * @param {object} aadhaarData - { dob: 'YYYY-MM-DD' } or a ZK proof/publicSignals
 * @returns {Promise<{dob: string, dobTimestamp: number}>}
 */
async function fetchAadhaarDOB(aadhaarData) {
  // In real implementation, parse and verify Aadhaar offline XML/JWT/QR
  // For privacy: do NOT store or return Aadhaar number, name, address, etc.
  if (!aadhaarData || !aadhaarData.dob) throw new Error('Aadhaar DOB missing');
  const dob = aadhaarData.dob;
  return { dob, dobTimestamp: toDaysTimestamp(dob) };
}

function toDaysTimestamp(dob) {
  // Convert YYYY-MM-DD to Unix timestamp (days)
  const dobDate = new Date(dob);
  return Math.floor(dobDate.getTime() / (1000 * 60 * 60 * 24));
}

function isEighteenPlus(dobTimestamp, todayTimestamp) {
  const minDob = todayTimestamp - (18 * 365); // Not accounting for leap years
  return dobTimestamp <= minDob;
}

module.exports = { fetchAadhaarDOB, isEighteenPlus };
