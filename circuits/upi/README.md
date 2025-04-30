# UPI Balance ZK Circuit

This circuit proves that a user's UPI/bank balance is above a threshold or that their balance hash matches a commitment, without revealing the raw balance or transactions.

- Inputs: balance, threshold, secret (optional)
- Outputs: valid (balance >= threshold), hash (commitment)
