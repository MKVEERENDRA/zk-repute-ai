# zkKYC Proof ZK Circuit

This circuit proves that a user has completed KYC with a provider, without revealing any sensitive data.

- Inputs: kycStatus, requiredStatus, secret (optional)
- Outputs: valid (status matches), hash (commitment)
