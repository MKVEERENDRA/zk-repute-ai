const axios = require('axios');

const BASE_URL = 'https://api.poap.tech';

// Fetch POAPs and events data for the given address
async function fetchPOAPData(address) {
  const headers = { 'X-API-Key': process.env.POAP_API_KEY || '' };
  const res = await axios.get(`${BASE_URL}/actions/scan/${address}`, { headers });
  const tokens = res.data || [];

  let uniqueEvents = new Set();
  let attendedEvents = 0;
  let highQualityEvents = 0;
  let recentEvents = 0;
  const now = new Date();

  for (const token of tokens) {
    uniqueEvents.add(token.event.id);
    attendedEvents++;

    // Scoring by high quality: community-chosen e.g., if there's a website or image
    if (token.event.image_url || token.event.site) highQualityEvents++;

    // Recent: events attended in the last 6 months
    const eventDate = new Date(token.event.start_date);
    const monthDiff = (now.getFullYear() - eventDate.getFullYear()) * 12 + (now.getMonth() - eventDate.getMonth());
    if (monthDiff <= 6) recentEvents++;
  }

  return {
    address,
    uniqueEvents: uniqueEvents.size,
    attendedEvents,
    highQualityEvents,
    recentEvents
  };
}

function calculatePOAPReputationScore(data) {
  let score = 0;
  score += data.attendedEvents * 3;
  score += data.highQualityEvents * 5;
  score += data.recentEvents * 4;
  score += data.uniqueEvents * 2;
  return Math.round(score);
}

module.exports = {
  fetchPOAPData,
  calculatePOAPReputationScore
};
