const axios = require('axios');

const SUREPASS_API_KEY = process.env.SUREPASS_API_KEY;

/**
 * Fetch DOB from Surepass using PAN, Sismo, or trusted input
 * @param {object} user - { pan, name, dob, mobile, polygonId, sismoId }
 * @returns {Promise<{dob: string, dobTimestamp: number, source: string}>}
 */
async function fetchUserDOB({ pan, name, dob, mobile, polygonId, sismoId }) {
  // 1. Try Surepass PAN API if PAN is provided and dob not already given
  if (pan && !dob) {
    try {
      const url = "https://kyc-api.surepass.io/api/v1/pan-details";
      const headers = {
        Authorization: `Bearer ${SUREPASS_API_KEY}`,
        "Content-Type": "application/json"
      };
      const payload = { pan_number: pan };
      const response = await axios.post(url, payload, { headers });
      dob = response.data.dob; // "YYYY-MM-DD"
      if (!dob) throw new Error('DOB not found for PAN');
      return { dob, dobTimestamp: toDaysTimestamp(dob), source: 'surepass' };
    } catch (e) {
      throw new Error('Could not fetch DOB from Surepass: ' + e.message);
    }
  }
  // 2. Try Sismo claim (pseudo-code, extend as needed)
  if (sismoId && !dob) {
    // TODO: Call Sismo API to fetch DOB claim or age credential
    // dob = await fetchDOBFromSismo(sismoId);
    // if (dob) return { dob, dobTimestamp: toDaysTimestamp(dob), source: 'sismo' };
  }
  // 3. Use provided dob if present
  if (!dob) throw new Error('DOB required or could not be fetched from any provider');
  return { dob, dobTimestamp: toDaysTimestamp(dob), source: 'input' };
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

module.exports = { fetchUserDOB, isEighteenPlus };
