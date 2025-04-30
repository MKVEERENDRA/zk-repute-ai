// backend/services/humanityScoreService.js
const axios = require('axios');

async function computeHumanityScore(address) {
  const apiUrl = `https://api.proofofhumanity.id/api/approvals/${address}`;
  const response = await axios.get(apiUrl);
  const approvalData = response.data;

  const isVerified = approvalData?.isRegistered || false;
  const verificationTimestamp = approvalData?.registeredOn || null;
  const numberOfVouches = approvalData?.vouchesReceived || 0;
  // Additional metrics
  const submissionDuration = approvalData?.submissionDuration || 0;
  const challengeCount = approvalData?.challengeCount || 0;
  const lostChallenges = approvalData?.lostChallenges || 0;

  const baseScore = isVerified ? 70 : 0;
  const vouchScore = Math.min(numberOfVouches * 5, 20);
  const challengePenalty = Math.min(lostChallenges * 5, 20);
  const durationBonus = Math.min(submissionDuration / (60 * 60 * 24 * 30), 10); // months
  const totalScore = baseScore + vouchScore - challengePenalty + durationBonus;

  return {
    isVerified,
    numberOfVouches,
    verificationTimestamp,
    submissionDuration,
    challengeCount,
    lostChallenges,
    score: totalScore
  };
}

module.exports = { computeHumanityScore };
