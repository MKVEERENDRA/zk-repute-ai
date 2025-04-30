// githubScore.circom
// Proves a user has >= X GitHub commits or a valid score hash
// Inputs: score, threshold, secret (optional)
// Outputs: valid, hash

include "../lib/greaterThan.circom";
include "../lib/mimc.circom";

// Template for GitHub Score validation
template GitHubScore() {
    signal input score;        // Reputation score (calculated from various metrics)
    signal input threshold;    // Minimum required score for validity
    signal input secret;       // Secret used to hash the score (can be used for obfuscation)
    signal output valid;       // Boolean output: true if score >= threshold
    signal output hash;        // The hashed score using secret

    // Check if score is greater than or equal to the threshold
    component gt = GreaterThan(32);
    gt.in[0] <== score;
    gt.in[1] <== threshold;
    valid <== gt.out;

    // Hash the score with a secret using MiMC7 for privacy
    component mimc = MiMC7();
    mimc.x_in <== score;
    mimc.k <== secret;
    hash <== mimc.out;
}

component main = GitHubScore();  // GitHub score component for ZK proof validation
