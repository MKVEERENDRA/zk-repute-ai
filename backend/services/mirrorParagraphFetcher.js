// backend/services/mirrorParagraphFetcher.js
import axios from 'axios';

// Fetch Mirror.xyz Articles (using The Graph)
export async function fetchMirrorArticles(userId) {
  const query = `{
    user(id: "${userId}") {
      publications(first: 10) {
        nodes {
          id
          title
          createdAt
          stats {
            claps
            comments
          }
        }
      }
    }
  }`;
  const response = await axios.post('https://api.thegraph.com/subgraphs/name/mirrorxyz/mirror', { query });
  return response.data.data?.user?.publications?.nodes || [];
}

// Fetch Paragraph Articles (using The Graph)
export async function fetchParagraphArticles(userId) {
  const query = `{
    user(id: "${userId}") {
      posts {
        id
        title
        createdAt
        likes
        comments
      }
    }
  }`;
  const response = await axios.post('https://api.paragraph.xyz/subgraphs/name/paragraphxyz/paragraph', { query });
  return response.data.data?.user?.posts || [];
}

// Scoring Function
export function scoreContributions(articles, platform) {
  let score = 0;
  articles.forEach(article => {
    // Base score for each article
    score += 10;
    // Platform-specific engagement metrics
    if (platform === 'mirror') {
      score += (article.stats?.claps || 0) * 0.5 + (article.stats?.comments || 0) * 0.3;
    } else if (platform === 'paragraph') {
      score += (article.likes || 0) * 0.4 + (article.comments || 0) * 0.3;
    }
  });
  return score;
}
