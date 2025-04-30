// zkKycProof.circom
// Proves a user has a valid KYC status without revealing sensitive data
include "../lib/equality.circom";
include "../lib/mimc.circom";

template ZkKycProof() {
    signal input kycStatus;
    signal input requiredStatus;
    signal input secret;
    signal output valid;
    signal output hash;

    component eq = Equality(32);
    eq.in[0] <== kycStatus;
    eq.in[1] <== requiredStatus;
    valid <== eq.out;

    component mimc = MiMC7();
    mimc.x_in <== kycStatus;
    mimc.k <== secret;
    hash <== mimc.out;
}

component main = ZkKycProof();
