const snoowrap = require('snoowrap'); // Reddit API wrapper

const r = new snoowrap({
  userAgent: 'ZKReputeApp',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

async function fetchRedditData(username) {
  const user = await r.getUser(username);
  const comments = await user.getComments({ limit: 100 });
  const posts = await user.getSubmissions({ limit: 100 });

  let commentKarma = user.comment_karma;
  let postKarma = user.link_karma;
  let upvotes = 0, awards = 0;

  posts.forEach(p => {
    upvotes += p.ups;
    awards += p.total_awards_received;
  });

  comments.forEach(c => {
    upvotes += c.ups;
    awards += c.total_awards_received;
  });

  return { commentKarma, postKarma, upvotes, awards, postsCount: posts.length, commentsCount: comments.length };
}

function calculateRedditScore(data) {
  let score = 0;
  score += data.commentKarma * 1;
  score += data.postKarma * 2;
  score += data.upvotes * 0.5;
  score += data.awards * 5;
  score += data.postsCount * 1;
  score += data.commentsCount * 0.5;
  return Math.round(score);
}

module.exports = { fetchRedditData, calculateRedditScore };
