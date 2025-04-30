// backend/routes/repute.js
// Composite ZK Reputation Proof Route

const express = require('express');
const router = express.Router();
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path configs (adjust as needed)
const CIRCUIT_DIR = path.join(__dirname, '../../circuits');
const COMPOSITE_CIRCUIT = path.join(CIRCUIT_DIR, 'reputeScore.circom');
const WASM_PATH = path.join(CIRCUIT_DIR, 'reputeScore_js/reputeScore.wasm');
const ZKEY_PATH = path.join(CIRCUIT_DIR, 'reputeScore.zkey');
const INPUT_PATH = path.join(CIRCUIT_DIR, 'input.json');
const WITNESS_PATH = path.join(CIRCUIT_DIR, 'witness.wtns');
const PROOF_PATH = path.join(CIRCUIT_DIR, 'proof.json');
const PUBLIC_PATH = path.join(CIRCUIT_DIR, 'public.json');

// POST /api/repute-composite
router.post('/repute-composite', async (req, res) => {
  try {
    // 1. Get all scores, thresholds, secrets from request
    const { twitterScore, githubScore, poapScore, upiScore, stackScore,
      twitterThreshold, githubThreshold, poapThreshold, upiThreshold, stackThreshold,
      twitterSecret, githubSecret, poapSecret, upiSecret, stackSecret } = req.body;

    // 2. Prepare input.json for the circuit
    const input = {
      twitterScore, githubScore, poapScore, upiScore, stackScore,
      twitterThreshold, githubThreshold, poapThreshold, upiThreshold, stackThreshold,
      twitterSecret, githubSecret, poapSecret, upiSecret, stackSecret
    };
    fs.writeFileSync(INPUT_PATH, JSON.stringify(input));

    // 3. Generate witness
    spawnSync('node', [path.join(CIRCUIT_DIR, 'reputeScore_js/generate_witness.js'), WASM_PATH, INPUT_PATH, WITNESS_PATH], { stdio: 'inherit' });

    // 4. Generate proof
    spawnSync('snarkjs', ['groth16', 'prove', ZKEY_PATH, WITNESS_PATH, PROOF_PATH, PUBLIC_PATH], { stdio: 'inherit' });

    // 5. Read proof and public signals
    const proof = JSON.parse(fs.readFileSync(PROOF_PATH));
    const publicSignals = JSON.parse(fs.readFileSync(PUBLIC_PATH));

    // 6. Respond with proof and public signals
    res.json({ proof, publicSignals });
  } catch (err) {
    console.error('Composite ZK proof error:', err);
    res.status(500).json({ error: 'Composite ZK proof generation failed.' });
  }
});

module.exports = router;
