// backend/services/twitterFetcher.js

// Mock data for now (replace with Twitter API in production)
const mockTwitterData = {
  username: 'veerenzk',
  tweetsLast30Days: 42,
  followers: 1200,
  following: 200,
  avgEngagement: 15.5 // likes + RTs + replies per tweet
};

function calculateTwitterScore(data) {
  const { tweetsLast30Days, followers, following, avgEngagement } = data;
  const tweetScore = Math.min(tweetsLast30Days / 50, 1) * 30;
  const followerRatioScore = Math.min(followers / (following + 1), 5) / 5 * 30;
  const engagementScore = Math.min(avgEngagement / 20, 1) * 40;
  const totalScore = tweetScore + followerRatioScore + engagementScore;
  return {
    score: Math.round(totalScore),
    details: {
      tweetScore,
      followerRatioScore,
      engagementScore
    }
  };
}

async function fetchTwitterData(handle) {
  // Placeholder — replace with Twitter API call
  console.log(`Fetching Twitter data for @${handle}`);
  return mockTwitterData;
}

export async function getTwitterReputation(handle) {
  const data = await fetchTwitterData(handle);
  const score = calculateTwitterScore(data);
  return {
    handle,
    ...score,
    raw: data
  };
}
