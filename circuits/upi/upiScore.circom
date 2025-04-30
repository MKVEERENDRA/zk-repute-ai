
// circuits/UPIScore.circom
pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";

component main { public [totalTxns, totalVolume, txnFrequency, stableBalanceScore, recurringPatternScore] } = Main();

template Main() {
    signal input totalTxns;
    signal input totalVolume;
    signal input txnFrequency;
    signal input stableBalanceScore;
    signal input recurringPatternScore;
    signal output fairScore;

    signal weightedTxns;
    signal weightedVolume;
    signal weightedFreq;
    signal weightedStable;
    signal weightedRecurring;

    weightedTxns <== totalTxns * 30;
    weightedVolume <== totalVolume * 30;
    weightedFreq <== txnFrequency * 20;
    weightedStable <== stableBalanceScore * 10;
    weightedRecurring <== recurringPatternScore * 10;

    fairScore <== (weightedTxns + weightedVolume + weightedFreq + weightedStable + weightedRecurring) / 100;
}
