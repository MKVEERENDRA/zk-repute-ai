// lessThan.circom
// Checks if a < b

template LessThan(n) {
    signal input in[2];
    signal output out;
    out <== in[0] < in[1];
}
