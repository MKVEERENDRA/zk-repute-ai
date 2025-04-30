const axios = require('axios');

// Mocked AI scoring logic for post quality, originality, etc.
function analyzePostsAI(posts) {
  let score = 0;
  // Assume we run AI on posts
  posts.forEach(post => {
    if (post.content.includes("web3")) score += 10;
    if (post.original) score += 5;
    if (post.comments > 5) score += 3;
  });
  return score;
}

async function fetchLensData(handle) {
  const headers = { 'Accept': 'application/json' };
  const baseURL = `https://api.lens.dev/`; // Adjust based on your GraphQL Lens setup

  // Replace with actual GraphQL queries or Neynar equivalents
  const posts = await axios.post(baseURL, {
    query: `
      query {
        publications(request: { profileId: "${handle}", publicationTypes: [POST] }) {
          items {
            metadata {
              content
            }
            stats {
              totalUpvotes
              totalComments
              totalMirrors
              totalCollects
            }
          }
        }
      }
    `
  }, { headers });

  const publicationData = posts.data.data.publications.items.map(p => ({
    content: p.metadata.content,
    likes: p.stats.totalUpvotes,
    comments: p.stats.totalComments,
    mirrors: p.stats.totalMirrors,
    collects: p.stats.totalCollects,
    original: !p.content.includes("mirror") // crude check
  }));

  const qualityScore = analyzePostsAI(publicationData);

  return {
    engagement: publicationData.length,
    scoreFromAI: qualityScore,
    totalLikes: publicationData.reduce((a, b) => a + b.likes, 0),
    totalComments: publicationData.reduce((a, b) => a + b.comments, 0),
    totalMirrors: publicationData.reduce((a, b) => a + b.mirrors, 0),
    totalCollects: publicationData.reduce((a, b) => a + b.collects, 0),
  };
}

function calculateLensScore(data) {
  let score = 0;
  score += data.scoreFromAI;
  score += data.totalLikes * 1;
  score += data.totalComments * 2;
  score += data.totalMirrors * 1;
  score += data.totalCollects * 3;
  return Math.round(score);
}

module.exports = {
  fetchLensData,
  calculateLensScore
};
