import axios from 'axios';

// In-memory cache (12h)
const cache = {};
const CACHE_TTL = 60 * 60 * 12 * 1000;

export async function getGitHubStats(username) {
  const now = Date.now();
  if (cache[username] && now - cache[username].ts < CACHE_TTL) {
    return cache[username].data;
  }
  const headers = { 'Accept': 'application/vnd.github+json' };
  // Profile
  const userRes = await axios.get(`https://api.github.com/users/${username}`, { headers });
  const { public_repos, followers, following } = userRes.data;
  // Events
  const eventsRes = await axios.get(`https://api.github.com/users/${username}/events/public`, { headers });
  const events = eventsRes.data;
  let commitCount = 0, prCount = 0, issueCount = 0;
  for (const event of events) {
    switch (event.type) {
      case 'PushEvent': commitCount += event.payload.commits.length; break;
      case 'PullRequestEvent': prCount++; break;
      case 'IssuesEvent': issueCount++; break;
    }
  }
  // Simple reputation logic
  const score = (commitCount * 2) + (prCount * 5) + (issueCount * 3) + (public_repos * 1.5) + (followers * 2);
  const data = {
    commits: commitCount,
    pull_requests: prCount,
    issues: issueCount,
    public_repos,
    followers,
    following,
    GitHubReputeScore: Math.round(score),
  };
  cache[username] = { ts: now, data };
  return data;
}
