const axios = require('axios');

// Function to fetch GitHub data
async function fetchGithubData(username) {
  const headers = {};
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  const userRes = await axios.get(`https://api.github.com/users/${username}`, { headers });
  const eventsRes = await axios.get(`https://api.github.com/users/${username}/events/public`, { headers });
  const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });

  let mergedPRs = 0;
  let closedIssues = 0;
  let starredWeb3Repos = 0;
  let reviewCommentsGiven = 0;
  let externalMergedPRs = 0;
  let orgsContributedTo = new Set();
  let activeMonths = new Set();

  // Loop through repos for detailed analysis
  for (const repo of reposRes.data) {
    // Web3 AI detection (inference from AI model)
    const isWeb3Repo = await aiDetectWeb3(repo); // Assume this function uses your AI model to detect Web3
    
    // If Web3, increase the counter
    if (isWeb3Repo) {
      starredWeb3Repos += 1;
    }

    // Fetch PRs and Issues to calculate contributions
    const pullsRes = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/pulls?state=closed`, { headers });
    mergedPRs += pullsRes.data.filter(pr => pr.merged_at).length;
    externalMergedPRs += pullsRes.data.filter(pr => pr.user.login !== username && pr.merged_at).length;

    const issuesRes = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/issues?state=closed`, { headers });
    closedIssues += issuesRes.data.filter(issue => issue.pull_request === undefined).length;

    // Fetch reviews on other's PRs
    const reviewsRes = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/pulls?state=all`, { headers });
    reviewCommentsGiven += reviewsRes.data.filter(pr => pr.user.login !== username).length;

    // Track org contributions
    const orgsRes = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/collaborators`, { headers });
    orgsRes.data.forEach(collab => orgsContributedTo.add(collab.login));

    // Track active months (based on contributions)
    const commitsRes = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/commits?since=2024-01-01`, { headers });
    commitsRes.data.forEach(commit => activeMonths.add(commit.committer.date.substring(0, 7)));  // Extract month-year
  }

  return {
    followers: userRes.data.followers,
    public_repos: userRes.data.public_repos,
    totalEvents: eventsRes.data.length,
    mergedPRs,
    closedIssues,
    starredWeb3Repos,
    externalMergedPRs,
    reviewCommentsGiven,
    orgsContributedTo: orgsContributedTo.size,
    activeMonths: activeMonths.size
  };
}

// AI-powered Web3 detection (mock-up for now)
async function aiDetectWeb3(repo) {
  // Make a call to the AI model to analyze the repo data
  // For now, mock it with a simple rule, you should replace it with an actual API call
  const description = repo.description.toLowerCase();
  const topics = repo.topics.map(topic => topic.toLowerCase());

  // Example of how an AI model might classify it
  if (description.includes("web3") || topics.includes("web3")) {
    return true;
  }
  return false;
}

// Reputation calculation using the collected metrics
function calculateReputationScore(data) {
  let score = 0;
  
  // Weighted calculation based on fairness and value-added metrics
  score += data.followers * 2;
  score += data.public_repos * 3;
  score += data.totalEvents * 1;
  score += data.mergedPRs * 5;
  score += data.closedIssues * 3;
  score += data.starredWeb3Repos * 10;  // Reward for Web3-relevant work
  score += data.externalMergedPRs * 4;
  score += data.reviewCommentsGiven * 2;
  score += data.orgsContributedTo * 6;
  score += data.activeMonths * 5;

  return Math.round(score);
}

module.exports = {
  fetchGithubData,
  calculateReputationScore
};
