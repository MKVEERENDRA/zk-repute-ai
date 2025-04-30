// circuits/creditScore/creditScore.circom
pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";

// Prove creditScore is valid and >= threshold

template CreditScoreProof() {
    signal input creditScore;       // e.g., CIBIL/Experian Score (300-900)
    signal input threshold;         // e.g., 750
    signal output passed;

    // Ensure score is within valid range (300-900 inclusive)
    component isAboveMin = GreaterEqThan(32);
    isAboveMin.in[0] <== creditScore;
    isAboveMin.in[1] <== 300;

    component isBelowMax = IsLessThan();
    isBelowMax.in[0] <== creditScore;
    isBelowMax.in[1] <== 901;

    component isAboveThreshold = GreaterEqThan(32);
    isAboveThreshold.in[0] <== creditScore;
    isAboveThreshold.in[1] <== threshold;

    passed <== isAboveMin.out * isBelowMax.out * isAboveThreshold.out;
}

component main = CreditScoreProof();
