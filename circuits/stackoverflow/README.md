# StackOverflow Reputation ZK Circuit

This circuit proves that a user's StackOverflow reputation score is above a threshold or that their score hash matches a commitment, without revealing the raw score or activity data.

- Inputs: score, threshold, secret (optional)
- Outputs: valid (score >= threshold), hash (commitment)
