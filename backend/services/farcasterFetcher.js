// services/farcasterFetcher.js
const axios = require('axios');

// Sample dummy fetch logic with Neynar API (AI processing to be added later)
async function fetchFarcasterData(username) {
  const apiKey = process.env.NEYNAR_API_KEY;
  const headers = { 'api_key': apiKey };

  const userRes = await axios.get(`https://api.neynar.com/v1/farcaster/user-by-username?username=${username}`, { headers });
  const fid = userRes.data.user.fid;

  const [profileRes, messagesRes] = await Promise.all([
    axios.get(`https://api.neynar.com/v1/farcaster/user?fid=${fid}`, { headers }),
    axios.get(`https://api.neynar.com/v1/farcaster/casts?fid=${fid}`, { headers })
  ]);

  return {
    profile: profileRes.data,
    messages: messagesRes.data.result.casts,
    fid
  };
}

function calculateFarcasterScore({ profile, messages }) {
  let score = 0;

  const followers = profile.user.follower_count || 0;
  const following = profile.user.following_count || 0;
  const followerRatio = followers / Math.max(following, 1);
  score += Math.min(10, followerRatio) * 2;

  const postCount = messages.length;
  score += Math.min(100, postCount) * 1;

  const totalLikes = messages.reduce((acc, msg) => acc + (msg.reactions.likes || 0), 0);
  const totalReplies = messages.reduce((acc, msg) => acc + (msg.replies.count || 0), 0);
  score += totalLikes * 1.5 + totalReplies * 2;

  return Math.round(score);
}

module.exports = {
  fetchFarcasterData,
  calculateFarcasterScore
};
