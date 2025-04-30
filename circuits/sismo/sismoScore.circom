// circuits/sismo/sismoScore.circom
pragma circom 2.0.0;

// Prove Sismo reputationScore >= threshold
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/mimc.circom";

template SismoScore() {
    signal input reputationScore;
    signal input threshold;
    signal input secret;
    signal output valid;
    signal output hash;

    component gt = GreaterThan(32);
    gt.in[0] <== reputationScore;
    gt.in[1] <== threshold;
    valid <== gt.out;

    component mimc = MiMC7();
    mimc.x_in <== reputationScore;
    mimc.k <== secret;
    hash <== mimc.out;
}

component main = SismoScore();
