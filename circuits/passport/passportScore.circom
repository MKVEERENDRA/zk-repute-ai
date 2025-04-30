// circuits/passport/passportScore.circom
pragma circom 2.0.0;

// This circuit proves the Passport.xyz score is >= a threshold
// Inputs: score, threshold, secret
// Outputs: valid (score >= threshold), hash (MiMC of score+secret)
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/mimc.circom";

template PassportScore() {
    signal input score;
    signal input threshold;
    signal input secret;
    signal output valid;
    signal output hash;

    component gt = GreaterThan(32);
    gt.in[0] <== score;
    gt.in[1] <== threshold;
    valid <== gt.out;

    component mimc = MiMC7();
    mimc.x_in <== score;
    mimc.k <== secret;
    hash <== mimc.out;
}

component main = PassportScore();
