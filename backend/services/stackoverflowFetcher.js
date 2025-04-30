const axios = require('axios');

async function fetchSOData(userId) {
  const res = await axios.get(`https://api.stackexchange.com/2.3/users/${userId}?site=stackoverflow`);
  const activity = await axios.get(`https://api.stackexchange.com/2.3/users/${userId}/timeline?site=stackoverflow`);
  
  const user = res.data.items[0];
  const timeline = activity.data.items;

  let answers = 0, accepted = 0, questions = 0, upvotes = 0, downvotes = 0, edits = 0;
  const activeDays = new Set();
  for (const event of timeline) {
    if (event.timeline_type === 'answer') answers++;
    if (event.timeline_type === 'accepted') accepted++;
    if (event.timeline_type === 'question') questions++;
    if (event.timeline_type === 'vote_aggregate') {
      upvotes += event.up_vote_count || 0;
      downvotes += event.down_vote_count || 0;
    }
    if (event.timeline_type === 'revision') edits++;
    activeDays.add(event.creation_date);
  }

  return {
    reputation: user.reputation,
    badges: user.badge_counts,
    answers,
    accepted,
    questions,
    upvotes,
    downvotes,
    edits,
    activeMonths: activeDays.size / 30 // rough
  };
}

function calculateSOScore(data) {
  let score = 0;
  score += data.answers * 5;
  score += data.accepted * 8;
  score += data.questions * 2;
  score += data.upvotes * 1;
  score -= data.downvotes * 2;
  score += data.edits * 1;
  score += data.activeMonths * 2;
  score += data.badges.gold * 10 + data.badges.silver * 5 + data.badges.bronze * 2;
  return Math.round(score);
}

module.exports = {
  fetchSOData,
  calculateSOScore
};
