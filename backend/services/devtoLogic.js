const axios = require('axios');

async function fetchDevtoData(username) {
  const url = `https://dev.to/api/articles?username=${username}`;
  const userUrl = `https://dev.to/api/users/by_username?url=${username}`;
  const [articlesRes, userRes] = await Promise.all([
    axios.get(url),
    axios.get(userUrl)
  ]);

  const articles = articlesRes.data;
  const user = userRes.data;

  const totalReactions = articles.reduce((sum, a) => sum + a.positive_reactions_count, 0);
  const totalComments = articles.reduce((sum, a) => sum + a.comments_count, 0);
  const totalArticles = articles.length;

  return {
    totalReactions,
    totalComments,
    totalArticles,
    followers: user.followers_count
  };
}

function calculateDevtoScore(data) {
  let score = 0;
  score += data.totalReactions * 2;
  score += data.totalComments * 3;
  score += data.totalArticles * 4;
  score += data.followers * 1.5;
  return Math.round(score);
}

module.exports = {
  fetchDevtoData,
  calculateDevtoScore
};
