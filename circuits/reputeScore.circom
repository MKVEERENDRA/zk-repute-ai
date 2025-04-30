// reputeScore.circom
// Composite circuit for multi-source ZK reputation aggregation

include "./twitter/twitterScore.circom";
include "./github/githubScore.circom";
include "./poap/poapScore.circom";
include "./upi/upiScore.circom";
include "./stackoverflow/stackoverflowScore.circom";
include "./lib/greaterThan.circom";


template ReputeScore() {
    // Inputs for each score system
    signal input twitterScore;
    signal input githubScore;
    signal input poapScore;
    signal input upiScore;
    signal input stackScore;

    // Thresholds
    signal input twitterThreshold;
    signal input githubThreshold;
    signal input poapThreshold;
    signal input upiThreshold;
    signal input stackThreshold;

    // Secrets
    signal input twitterSecret;
    signal input githubSecret;
    signal input poapSecret;
    signal input upiSecret;
    signal input stackSecret;

    // Outputs: Individual hashes
    signal output twitterHash;
    signal output githubHash;
    signal output poapHash;
    signal output upiHash;
    signal output stackHash;

    // Final output: total number of valid scores >= threshold
    signal output finalValid;

    // Instantiate sub-circuits
    component twitter = TwitterScore();
    component github = GitHubScore();
    component poap = PoapScore();
    component upi = UpiScore();
    component stack = StackOverflowScore();

    // Connect inputs
    twitter.score <== twitterScore;
    twitter.threshold <== twitterThreshold;
    twitter.secret <== twitterSecret;
    twitterHash <== twitter.hash;

    github.score <== githubScore;
    github.threshold <== githubThreshold;
    github.secret <== githubSecret;
    githubHash <== github.hash;

    poap.score <== poapScore;
    poap.threshold <== poapThreshold;
    poap.secret <== poapSecret;
    poapHash <== poap.hash;

    upi.score <== upiScore;
    upi.threshold <== upiThreshold;
    upi.secret <== upiSecret;
    upiHash <== upi.hash;

    stack.score <== stackScore;
    stack.threshold <== stackThreshold;
    stack.secret <== stackSecret;
    stackHash <== stack.hash;

    // Count how many are valid (simple sum)
    signal totalValid;
    totalValid <== twitter.valid + github.valid + poap.valid + upi.valid + stack.valid;

    // Final check: e.g. require at least 3 out of 5 scores valid
    component minValid = GreaterThan(3);
    minValid.in[0] <== totalValid;
    minValid.in[1] <== 2;  // >=3 means greater than 2
    finalValid <== minValid.out;
}

component main = ReputeScore();
