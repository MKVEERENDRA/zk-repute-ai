// backend/services/stackoverflowFetcher.js
import axios from 'axios';

// In-memory cache (12h)
const cache = {};
const CACHE_TTL = 60 * 60 * 12 * 1000;

// Fetch StackOverflow user's public data
async function fetchStackOverflowData(userId) {
  const now = Date.now();
  if (cache[userId] && now - cache[userId].ts < CACHE_TTL) {
    return cache[userId].data;
  }
  const url = `https://api.stackexchange.com/2.3/users/${userId}?site=stackoverflow&filter=!*rX3zoy@67KJlF3v`;
  try {
    const response = await axios.get(url);
    const data = response.data.items[0] || {};
    cache[userId] = { ts: now, data };
    return data;
  } catch (err) {
    console.error('StackOverflow Fetch Error:', err.message);
    return {};
  }
}

function calculateStackOverflowScore(data) {
  const reputation = data.reputation || 0;
  const answerCount = data.answer_count || 0;
  const upvoteCount = data.up_vote_count || 0;
  // Reputation Score
  const reputationScore = Math.min(reputation / 5000, 1) * 40;
  // Answer Quality Score (based on answer count + upvotes)
  const answerScore = Math.min((answerCount * 2 + upvoteCount) / 50, 1) * 40;
  // Engagement Score (in terms of recent activity)
  const recentActivityScore = Math.min(answerCount / 10, 1) * 20;
  const totalScore = reputationScore + answerScore + recentActivityScore;
  return {
    score: Math.round(totalScore),
    breakdown: {
      reputationScore,
      answerScore,
      recentActivityScore
    },
    reputation,
    answerCount,
    upvoteCount
  };
}

export async function getStackOverflowReputation(userId) {
  const data = await fetchStackOverflowData(userId);
  const score = calculateStackOverflowScore(data);
  return {
    userId,
    ...score
  };
}
