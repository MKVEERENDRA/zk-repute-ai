// services/twitterFetcher.js
const { TwitterApi } = require('twitter-api-v2');

// Set up the Twitter client using your API keys (you'll need to get them from the Twitter Developer Portal)
const twitterClient = new TwitterApi({
  appKey: 'YOUR_TWITTER_APP_KEY',
  appSecret: 'YOUR_TWITTER_APP_SECRET',
  accessToken: 'YOUR_TWITTER_ACCESS_TOKEN',
  accessSecret: 'YOUR_TWITTER_ACCESS_SECRET',
});

// Function to fetch Twitter data for a given username
const getTwitterData = async (username) => {
  try {
    // Fetch user data (e.g., tweets, followers, etc.)
    const user = await twitterClient.v2.userByUsername(username, {
      'user.fields': ['public_metrics', 'created_at'],
    });

    // Fetch the user's tweets (you can adjust the tweet fields and limit as needed)
    const tweets = await twitterClient.v2.userTimeline(user.data.id, {
      max_results: 10, // Fetch the latest 10 tweets (adjust as needed)
      'tweet.fields': ['public_metrics', 'created_at'],
    });

    // Return the combined data (user profile and recent tweets)
    return {
      account: user.data,
      tweets: tweets.data,
    };
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    throw new Error('Failed to fetch Twitter data');
  }
};

module.exports = { getTwitterData };
