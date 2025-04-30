# Mirror/Paragraph Reputation ZK Circuit

This circuit proves that a user's Mirror.xyz or Paragraph reputation score is above a threshold or that their score hash matches a commitment, without revealing the raw score or article data.

- Inputs: score, threshold, secret (optional)
- Outputs: valid (score >= threshold), hash (commitment)
