// circuits/luxury/luxuryScore.circom
pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/mimc.circom";

template LuxuryScore() {
    signal input score;        // normalized luxury asset score (0-1)
    signal input threshold;    // e.g., 0.5
    signal input secret;
    signal output valid;
    signal output hash;

    component gt = GreaterThan(32);
    gt.in[0] <== score * 1000;      // scale to int for comparison
    gt.in[1] <== threshold * 1000;
    valid <== gt.out;

    component mimc = MiMC7();
    mimc.x_in <== score * 1000;
    mimc.k <== secret;
    hash <== mimc.out;
}

component main = LuxuryScore();
