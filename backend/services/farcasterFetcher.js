// backend/services/farcasterFetcher.js

const mockFarcasterData = {
  fid: 12345,
  username: 'veeren',
  followers: 450,
  casts: 90,
  recasts: 35,
  likes: 210,
};

function calculateFarcasterScore(data) {
  const { casts, followers, recasts, likes } = data;
  const castScore = Math.min(casts / 100, 1) * 30;
  const followerScore = Math.min(followers / 1000, 1) * 30;
  const engagementScore = Math.min((recasts + likes) / 300, 1) * 40;
  const totalScore = castScore + followerScore + engagementScore;
  return {
    score: Math.round(totalScore),
    details: {
      castScore,
      followerScore,
      engagementScore
    }
  };
}

async function fetchFarcasterData(username) {
  // Mock for now — replace with Farcaster API call for production
  console.log(`Fetching Farcaster data for ${username}`);
  return mockFarcasterData;
}

export async function getFarcasterReputation(username) {
  const data = await fetchFarcasterData(username);
  const score = calculateFarcasterScore(data);
  return {
    username,
    ...score,
    raw: data
  };
}
