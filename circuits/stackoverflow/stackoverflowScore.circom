include "../lib/greaterThan.circom";
include "../lib/mimc.circom";

template SOScore() {
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

component main = SOScore();
