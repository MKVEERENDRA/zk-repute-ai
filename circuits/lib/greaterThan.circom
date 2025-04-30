// greaterThan.circom
// Checks if a >= b

template GreaterThan(n) {
    signal input in[2];
    signal output out;
    out <== in[0] >= in[1];
}
