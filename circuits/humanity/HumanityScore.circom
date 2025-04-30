// circuits/humanity/HumanityScore.circom
pragma circom 2.0.0;

component main { public [isVerified, vouchCount, submissionDuration, challengeCount, lostChallenges] } = Main();

template Main() {
    signal input isVerified;      // boolean 0 or 1
    signal input vouchCount;      // number of vouches
    signal input submissionDuration; // seconds
    signal input challengeCount;
    signal input lostChallenges;
    signal output humanityScore;

    signal verifiedScore;
    signal vouchScore;
    signal challengePenalty;
    signal durationBonus;

    verifiedScore <== isVerified * 70;
    vouchScore <== vouchCount * 5;
    challengePenalty <== lostChallenges * 5;
    durationBonus <== submissionDuration / (60 * 60 * 24 * 30); // months

    humanityScore <== verifiedScore + vouchScore - challengePenalty + durationBonus;
}
