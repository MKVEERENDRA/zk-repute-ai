// backend/services/poapFetcher.js
import axios from 'axios';

async function fetchPoaps(ethAddress) {
  const url = `https://api.poap.tech/actions/scan/${ethAddress}`;
  try {
    const response = await axios.get(url, {
      headers: { /* 'X-API-Key': process.env.POAP_API_KEY || '' */ }
    });
    return response.data || [];
  } catch (err) {
    console.error('POAP Fetch Error:', err.message);
    return [];
  }
}

function calculatePoapScore(poaps) {
  const totalPoaps = poaps.length;
  // Unique events
  const uniqueEventIds = new Set(poaps.map(p => p.event.id));
  const uniqueScore = Math.min(uniqueEventIds.size / 10, 1) * 40;
  // Recent activity (last 6 months)
  const now = new Date();
  const recentPoaps = poaps.filter(p => {
    const eventDate = new Date(p.event.start_date);
    const diffMonths = (now - eventDate) / (1000 * 60 * 60 * 24 * 30);
    return diffMonths <= 6;
  });
  const recentScore = Math.min(recentPoaps.length / 5, 1) * 30;
  // Diversity of events
  const eventTitles = poaps.map(p => p.event.name.toLowerCase());
  const isHackathon = eventTitles.filter(e => e.includes('hackathon')).length;
  const isCommunity = eventTitles.filter(e => e.includes('community')).length;
  const diversityScore = Math.min((isHackathon + isCommunity) / 5, 1) * 30;
  const totalScore = uniqueScore + recentScore + diversityScore;
  return {
    score: Math.round(totalScore),
    breakdown: {
      uniqueScore,
      recentScore,
      diversityScore
    },
    totalPoaps
  };
}

export async function getPoapReputation(address) {
  const poaps = await fetchPoaps(address);
  const score = calculatePoapScore(poaps);
  return {
    address,
    ...score,
    rawPoaps: poaps.slice(0, 5), // preview
  };
}
