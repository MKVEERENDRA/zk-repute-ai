// circuits/ageProof/ageOver18.circom
pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";

// Prove user is 18+ (dob <= today - 18*365)
template AgeOver18() {
    signal input dob;     // Date of birth as Unix timestamp (days)
    signal input today;   // Current date as Unix timestamp (days)
    signal output isAdult;

    signal minDob;
    minDob <== today - (18 * 365); // Not accounting for leap years

    component cmp = LessThan();
    cmp.in[0] <== dob;
    cmp.in[1] <== minDob;

    isAdult <== cmp.out;
}

component main = AgeOver18();
